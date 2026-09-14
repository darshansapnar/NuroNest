/**
 * Technology-independent contract for anything that can generate Nuro's
 * reply. `nuro.ts` and `route.ts` depend only on this shape, so swapping
 * Gemini for another model provider — or inserting RAG retrieval in front
 * of it later — never requires touching the chat API.
 */

/** Maximum characters accepted for a single incoming chat message. */
export const MAX_MESSAGE_LENGTH = 4000;

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface GenerateReplyParams {
  /** Nuro's persona and behavioral guardrails for this turn. */
  systemInstruction: string;
  /** Prior turns, oldest first. Does not include `message`. */
  history: ChatMessage[];
  /** The user's newest message. */
  message: string;
}

export interface GenerateReplyResult {
  content: string;
}

export interface AiProvider {
  generateReply(params: GenerateReplyParams): Promise<GenerateReplyResult>;
}

/**
 * Thrown by provider implementations instead of letting raw SDK/network
 * errors escape. Callers can catch this one type and respond gracefully
 * without leaking upstream error details to the client.
 */
export class AiProviderError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AiProviderError";
  }
}
