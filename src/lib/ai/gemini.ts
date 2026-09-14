import "server-only";

import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  type Content,
} from "@google/genai";

import {
  AiProviderError,
  type AiProvider,
  type ChatMessage,
  type GenerateReplyParams,
  type GenerateReplyResult,
} from "@/lib/ai/provider";

// Gemini Flash: fast, low-latency model well suited to a conversational
// companion. Keep this the single place the model id is chosen.
//
// NOTE: gemini-2.5-flash was requested originally, but this API key returns
// 404 ("no longer available to new users") for it — confirmed live against
// the Gemini API, not a training-data assumption. gemini-3.6-flash is the
// concrete, pinned replacement Google's own error message pointed to, and
// was confirmed working. Revisit if/when 2.5-flash access is restored, or a
// newer pinned version should be adopted.
const MODEL = "gemini-3.6-flash";

const GENERATION_CONFIG = {
  temperature: 0.6,
  maxOutputTokens: 1024,
} as const;

// Gemini's own content filter is a second line of defense, not our primary
// one — the app's own safety layer (src/lib/ai/safety-detection.ts,
// safety-state.ts, and crisis-response.ts) runs before any request reaches
// Gemini and is what decides crisis-level handling.
const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

let cachedClient: GoogleGenAI | null = null;

/**
 * Lazily constructs the Gemini client so a missing `GEMINI_API_KEY` only
 * fails an actual chat request, not module import or `next build`.
 */
function getClient(): GoogleGenAI {
  if (cachedClient) {
    return cachedClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiProviderError(
      "GEMINI_API_KEY is not configured on the server.",
    );
  }

  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
}

function toGeminiContents(
  history: ChatMessage[],
  message: string,
): Content[] {
  const contents: Content[] = history.map((entry) => ({
    role: entry.role === "assistant" ? "model" : "user",
    parts: [{ text: entry.content }],
  }));

  contents.push({ role: "user", parts: [{ text: message }] });

  return contents;
}

export function createGeminiProvider(): AiProvider {
  return {
    async generateReply({
      systemInstruction,
      history,
      message,
    }: GenerateReplyParams): Promise<GenerateReplyResult> {
      const ai = getClient();

      let text: string | undefined;
      try {
        const response = await ai.models.generateContent({
          model: MODEL,
          contents: toGeminiContents(history, message),
          config: {
            systemInstruction,
            safetySettings: SAFETY_SETTINGS,
            ...GENERATION_CONFIG,
          },
        });

        text = response.text?.trim();
      } catch (error) {
        if (error instanceof AiProviderError) {
          throw error;
        }
        throw new AiProviderError("Gemini request failed.", {
          cause: error,
        });
      }

      if (!text) {
        throw new AiProviderError(
          "Gemini returned an empty or blocked response.",
        );
      }

      return { content: text };
    },
  };
}
