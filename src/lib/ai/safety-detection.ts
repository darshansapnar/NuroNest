/**
 * Module 1: Nuro Safety Detection Layer.
 *
 * Deterministic, rule-based classification of a single user message into a
 * risk level — no model call, no randomness. This is the layer the project
 * rule "do not let Gemini decide the final safety classification" refers
 * to: it runs before every Gemini request and Gemini never sees it or
 * influences it.
 *
 * This module ONLY classifies. It intentionally does not build crisis
 * responses, pick resources, or decide what Nuro says next — see
 * `crisis-response.ts` and `crisis-resources.ts` for that.
 *
 * "Contextual" here means more than flat keyword matching:
 *  - SUBJECT: is the risk language about the speaker (SELF) or someone else
 *    (OTHER — "my friend", "she", ...)? Detected per-match, scoped to the
 *    clause the match appears in, so one message can correctly mix "I'm
 *    worried about my friend, and I've been struggling too."
 *  - CONTEXT: informational/definitional ("what does X mean?"), fictional
 *    or educational framing ("in the novel...", "for my class..."), and
 *    quoted text all suppress escalation for topical/bare mentions of a
 *    risk term (e.g. "suicidal", "self-harm") — but NOT for an explicit
 *    first-person disclosure ("I want to kill myself"), which is never
 *    suppressed by context.
 *  - IMMINENCE: near-term/urgency language ("tonight", "right now", "about
 *    to") escalates an already-risky, self-referential message to
 *    IMMEDIATE.
 *
 * This is a heuristic, not a clinical tool, and is deliberately
 * over-inclusive where signals conflict: a missed risk signal is far more
 * costly than a false positive that gets a gentle check-in it didn't need.
 */

export type RiskLevel = "NONE" | "LOW" | "MODERATE" | "HIGH" | "IMMEDIATE";

/** Who the detected risk language is about. */
export type RiskSubject = "SELF" | "OTHER" | "UNSPECIFIED";

export interface SafetyDetectionResult {
  level: RiskLevel;
  /** Subject of the highest-severity contributing signal, if any. */
  subject: RiskSubject;
  /** True when near-term/urgency language escalated the level to IMMEDIATE. */
  imminent: boolean;
  /**
   * True when informational/fictional/quoted framing suppressed a signal
   * that would otherwise have contributed to the level (regardless of
   * whether other, non-suppressed signals still produced a non-NONE level).
   */
  contextSuppressed: boolean;
  /**
   * Every signal name found, for tests/debugging/future modules.
   * Suppressed matches are prefixed "suppressed:" rather than omitted, so
   * later modules can still see what was present in the message.
   */
  signals: string[];
}

const LEVEL_ORDER: RiskLevel[] = ["NONE", "LOW", "MODERATE", "HIGH", "IMMEDIATE"];

function severityIndex(level: RiskLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

function maxLevel(a: RiskLevel, b: RiskLevel): RiskLevel {
  return severityIndex(a) >= severityIndex(b) ? a : b;
}

// Base severity for risk language about a THIRD PARTY is one step below what
// the same phrase would score for the speaker themselves, floored at LOW —
// still worth gentle attention (and the speaker may need support in
// supporting someone else), but not treated as the speaker's own emergency.
const OTHER_SUBJECT_DOWNGRADE: Record<RiskLevel, RiskLevel> = {
  NONE: "NONE",
  LOW: "LOW",
  MODERATE: "LOW",
  HIGH: "MODERATE",
  IMMEDIATE: "MODERATE",
};

type RiskTier = "DISTRESS" | "IDEATION" | "INTENT" | "PLAN";

const TIER_BASE_LEVEL: Record<RiskTier, RiskLevel> = {
  DISTRESS: "LOW",
  IDEATION: "MODERATE",
  INTENT: "HIGH",
  PLAN: "HIGH",
};

// Tiers eligible for IMMEDIATE escalation when imminence language is
// present. Everyday distress (stress, anxiety, ...) never escalates this
// way — "I'm stressed tonight" is not a safety event.
const IMMINENCE_ELIGIBLE_TIERS: RiskTier[] = ["IDEATION", "INTENT", "PLAN"];

interface RiskPattern {
  tier: RiskTier;
  /** Stable name for tests/debugging/future modules. */
  signal: string;
  pattern: RegExp;
  /**
   * True for topical/nouny mentions of a risk term ("suicidal", "self-harm",
   * "suicidal thoughts") that commonly appear in informational, fictional,
   * or quoted contexts without personal disclosure. False for explicit
   * first-person intent/plan phrasing ("kill myself", "have a plan to..."),
   * which context never suppresses.
   */
  bare: boolean;
}

const RISK_PATTERNS: RiskPattern[] = [
  // --- DISTRESS: everyday emotional strain, not itself a safety concern ---
  { tier: "DISTRESS", signal: "anxiety", bare: true, pattern: /\banxi(ety|ous)\b/i },
  { tier: "DISTRESS", signal: "panic", bare: true, pattern: /\bpanic\b/i },
  { tier: "DISTRESS", signal: "overwhelmed", bare: true, pattern: /\boverwhelm(ed|ing)?\b/i },
  { tier: "DISTRESS", signal: "stress", bare: true, pattern: /\bstress(ed|ful)?\b/i },
  { tier: "DISTRESS", signal: "depressed", bare: true, pattern: /\bdepress(ed|ion)\b/i },
  { tier: "DISTRESS", signal: "lonely", bare: true, pattern: /\b(lonely|loneliness)\b/i },
  { tier: "DISTRESS", signal: "isolated", bare: true, pattern: /\bisolat(ed|ion)\b/i },
  { tier: "DISTRESS", signal: "exhausted", bare: true, pattern: /\bexhaust(ed|ing)\b/i },
  { tier: "DISTRESS", signal: "crying", bare: true, pattern: /\b(crying|cried)\b/i },
  { tier: "DISTRESS", signal: "cant-sleep", bare: true, pattern: /can'?t\s+sleep/i },
  { tier: "DISTRESS", signal: "cant-cope", bare: true, pattern: /can'?t\s+cope/i },
  { tier: "DISTRESS", signal: "breaking-down", bare: true, pattern: /breaking\s+down/i },
  { tier: "DISTRESS", signal: "worthless", bare: true, pattern: /\bworthless\b/i },
  { tier: "DISTRESS", signal: "numb", bare: true, pattern: /\bnumb\b/i },
  { tier: "DISTRESS", signal: "burned-out", bare: true, pattern: /burn(ed|t)?\s+out/i },

  // --- IDEATION: hopelessness, passive/ambiguous or unspecified ideation ---
  { tier: "IDEATION", signal: "hopeless", bare: true, pattern: /\bhopeless(ness)?\b/i },
  {
    tier: "INTENT",
    signal: "suicidal-thoughts",
    bare: true,
    pattern: /suicidal\s+(thoughts|ideation|feelings)/i,
  },
  {
    tier: "INTENT",
    signal: "thinking-about-suicide",
    bare: true,
    pattern: /think(ing)?\s+about\s+suicid(e|al)/i,
  },
  { tier: "IDEATION", signal: "suicidal-bare", bare: true, pattern: /\bsuicidal\b/i },
  { tier: "IDEATION", signal: "suicide-bare", bare: true, pattern: /\bsuicide\b/i },
  { tier: "IDEATION", signal: "self-harm-reference", bare: true, pattern: /self[-\s]?harm(ing)?\b/i },
  { tier: "IDEATION", signal: "want-to-disappear", bare: true, pattern: /want(ed)?\s+to\s+disappear/i },
  { tier: "IDEATION", signal: "cant-go-on", bare: true, pattern: /can'?t\s+go\s+on/i },
  { tier: "IDEATION", signal: "no-point", bare: true, pattern: /\bno\s+point\b/i },

  // --- INTENT: explicit desire/intent to die or to harm oneself ---
  { tier: "INTENT", signal: "want-to-die", bare: false, pattern: /(want(ed)?|going)\s+to\s+die/i },
  { tier: "INTENT", signal: "kill-myself", bare: false, pattern: /kill(ing)?\s+myself/i },
  { tier: "INTENT", signal: "end-my-life", bare: false, pattern: /end(ing)?\s+(my\s+life|it\s+all)/i },
  {
    tier: "INTENT",
    signal: "dont-want-to-live",
    bare: false,
    pattern: /don'?t\s+want\s+to\s+(be\s+alive|live|exist)\s+anymore/i,
  },
  {
    tier: "INTENT",
    signal: "no-reason-to-live",
    bare: false,
    pattern: /no\s+(reason|point)\s+(in|to)\s+liv(e|ing)/i,
  },
  { tier: "INTENT", signal: "better-off-dead", bare: false, pattern: /better\s+off\s+dead/i },
  { tier: "INTENT", signal: "hurt-myself", bare: false, pattern: /hurt(ing)?\s+myself/i },
  { tier: "INTENT", signal: "cut-myself", bare: false, pattern: /cut(ting)?\s+myself/i },
  {
    tier: "INTENT",
    signal: "wish-not-here",
    bare: false,
    pattern: /wish\s+i\s+(was|were)n'?t\s+(alive|here)/i,
  },
  { tier: "INTENT", signal: "overdose", bare: false, pattern: /overdos(e|ing)/i },

  // --- PLAN: an articulated method/plan ---
  {
    tier: "PLAN",
    signal: "has-a-plan",
    bare: false,
    pattern: /(have|has|made|making)\s+a\s+plan\s+to\s+(kill|hurt|end)/i,
  },
  {
    tier: "PLAN",
    signal: "planning-to-harm",
    bare: false,
    pattern: /plan(ning)?\s+to\s+(kill|hurt)\s+myself/i,
  },
];

// Near-term/active-danger language. Only escalates a SELF (or UNSPECIFIED)
// match that's already at IDEATION tier or above — never applies to plain
// distress, and never to a message that's about someone else.
const IMMINENCE_PATTERNS: RegExp[] = [
  /\babout\s+to\b/i,
  /\bright\s+now\b/i,
  /\btonight\b/i,
  /\bgoing\s+to\s+do\s+it\b/i,
  /\bready\s+to\s+(die|end\s+it)\b/i,
  /\bthis\s+is\s+goodbye\b/i,
  /\bcan'?t\s+wait\s+any\s+longer\b/i,
];

// --- Subject detection ------------------------------------------------
// Deliberately excludes bare "my" — "my friend"/"my brother" contain "my"
// but are about someone else, so a bare possessive is too ambiguous to
// count as a self-signal on its own.
const SELF_PRONOUN_PATTERN = /\b(i'm|i've|i'll|i'd|i|me|myself|mine)\b/i;
const OTHER_SUBJECT_PATTERN =
  /\b(he|she|they|him|her|them|his|their|someone i know|a friend( of mine)?|my (friend|brother|sister|mom|mother|dad|father|parent|partner|boyfriend|girlfriend|husband|wife|colleague|classmate|roommate)|a (classmate|colleague|coworker))\b/i;

// Clause boundaries used to scope subject detection so "My friend talked
// about suicide, and I'm really worried" doesn't let the "I'm" in the
// second clause get attributed to the risk language in the first.
const CLAUSE_BOUNDARY = /[.!?;,]|\b(?:and|but|so|because)\b/gi;

function extractClauseSpan(message: string, matchIndex: number): { text: string; start: number } {
  CLAUSE_BOUNDARY.lastIndex = 0;
  let start = 0;
  let end = message.length;
  let boundary: RegExpExecArray | null;

  while ((boundary = CLAUSE_BOUNDARY.exec(message))) {
    if (boundary.index < matchIndex) {
      start = boundary.index + boundary[0].length;
    } else {
      end = boundary.index;
      break;
    }
  }

  return { text: message.slice(start, end), start };
}

function detectSubjectForMatch(message: string, matchIndex: number): RiskSubject {
  const { text: clause, start } = extractClauseSpan(message, matchIndex);
  const localIndex = matchIndex - start;

  const otherMatch = OTHER_SUBJECT_PATTERN.exec(clause);
  const selfMatch = SELF_PRONOUN_PATTERN.exec(clause);

  if (otherMatch && !selfMatch) return "OTHER";
  if (selfMatch && !otherMatch) return "SELF";
  if (selfMatch && otherMatch) {
    // Both appear in the same clause — whichever is textually closer to
    // the risk phrase wins (e.g. "I'm worried about my friend who is
    // suicidal" should resolve to OTHER, not SELF).
    const otherDistance = Math.abs(otherMatch.index - localIndex);
    const selfDistance = Math.abs(selfMatch.index - localIndex);
    return otherDistance < selfDistance ? "OTHER" : "SELF";
  }

  return "UNSPECIFIED";
}

// --- Context suppression ------------------------------------------------

const INFORMATIONAL_PATTERNS: RegExp[] = [
  /^\s*(what|why|how)\b[\s\S]*\?\s*$/i,
  /\bwhat\s+(does|is|are)\b[\s\S]*\bmean(s)?\b/i,
  /\b(define|definition\s+of|meaning\s+of)\b/i,
  /\bis\s+it\s+true\s+that\b/i,
];

const FICTIONAL_OR_EDUCATIONAL_PATTERNS: RegExp[] = [
  /\b(the\s+)?(book|novel|movie|film|show|series|story|game|character|plot)\b/i,
  /\bfor\s+(my|a|our)\s+(class|essay|assignment|project|research|homework|course|paper)\b/i,
  /\b(studying|learning\s+about|researching)\b/i,
  /\barticle\s+(about|on)\b/i,
  /\bdocumentary\b/i,
  /\bfiction(al(ly)?)?\b/i,
];

function hasInformationalOrFictionalContext(message: string): boolean {
  return (
    INFORMATIONAL_PATTERNS.some((p) => p.test(message)) ||
    FICTIONAL_OR_EDUCATIONAL_PATTERNS.some((p) => p.test(message))
  );
}

// Single-quote matching excludes an opening/closing mark that's directly
// adjacent to a letter, so contraction apostrophes ("I'm", "don't") are
// never mistaken for the start or end of a quoted span.
function isWithinQuotes(message: string, matchIndex: number): boolean {
  const quotePattern = /"[^"]*"|(?<![A-Za-z])'[^']*'(?![A-Za-z])/g;
  let m: RegExpExecArray | null;
  while ((m = quotePattern.exec(message))) {
    if (matchIndex >= m.index && matchIndex < m.index + m[0].length) {
      return true;
    }
  }
  return false;
}

// --- Main classification --------------------------------------------

interface Candidate {
  signal: string;
  level: RiskLevel;
  subject: RiskSubject;
  imminent: boolean;
  suppressed: boolean;
}

export function detectSafety(message: string): SafetyDetectionResult {
  const informationalContext = hasInformationalOrFictionalContext(message);
  const hasImminenceLanguage = IMMINENCE_PATTERNS.some((p) => p.test(message));

  const candidates: Candidate[] = [];

  for (const risk of RISK_PATTERNS) {
    const match = risk.pattern.exec(message);
    if (!match) continue;

    const subject = detectSubjectForMatch(message, match.index);
    const suppressible = risk.bare && (informationalContext || isWithinQuotes(message, match.index));

    if (suppressible) {
      candidates.push({
        signal: risk.signal,
        level: "NONE",
        subject,
        imminent: false,
        suppressed: true,
      });
      continue;
    }

    let level = TIER_BASE_LEVEL[risk.tier];
    let imminent = false;

    if (subject === "OTHER") {
      level = OTHER_SUBJECT_DOWNGRADE[level];
    } else if (hasImminenceLanguage && IMMINENCE_ELIGIBLE_TIERS.includes(risk.tier)) {
      level = "IMMEDIATE";
      imminent = true;
    }

    candidates.push({ signal: risk.signal, level, subject, imminent, suppressed: false });
  }

  const contextSuppressed = candidates.some((c) => c.suppressed);
  const signals = candidates.map((c) => (c.suppressed ? `suppressed:${c.signal}` : c.signal));

  const surviving = candidates.filter((c) => !c.suppressed);
  if (surviving.length === 0) {
    return { level: "NONE", subject: "UNSPECIFIED", imminent: false, contextSuppressed, signals };
  }

  let winner = surviving[0];
  for (const candidate of surviving) {
    if (severityIndex(candidate.level) > severityIndex(winner.level)) {
      winner = candidate;
    }
  }

  return {
    level: winner.level,
    subject: winner.subject,
    imminent: winner.imminent,
    contextSuppressed,
    signals,
  };
}

/** Exported for tests and future modules that need to compare levels. */
export function isAtLeast(level: RiskLevel, threshold: RiskLevel): boolean {
  return severityIndex(level) >= severityIndex(threshold);
}

export { maxLevel };
