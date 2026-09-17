import type { AnyAssessmentResult, AssessmentType } from "./types";

// Sessionstorage is a stand-in for a future backend call (e.g. POST /api/assessments).
// Keeping the read/write behind this module means swapping in a real API later
// only requires changing this file, not the questionnaires or result pages.
const STORAGE_PREFIX = "nuronest:assessment:result:";

// Cached per type so loadAssessmentResult() returns a stable reference across
// calls — required for safe use with useSyncExternalStore (a new object every
// call would look like a change on every render and loop).
const cache = new Map<AssessmentType, AnyAssessmentResult | null>();
const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function saveAssessmentResult(result: AnyAssessmentResult): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_PREFIX + result.assessmentType, JSON.stringify(result));
    cache.set(result.assessmentType, result);
    notifyListeners();
  } catch {
    // Ignore storage failures (e.g. private browsing) — the result page will
    // fall back to its empty state.
  }
}

export function loadAssessmentResult(type: AssessmentType): AnyAssessmentResult | null {
  if (typeof window === "undefined") return null;
  if (cache.has(type)) return cache.get(type) ?? null;
  let result: AnyAssessmentResult | null = null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_PREFIX + type);
    result = raw ? (JSON.parse(raw) as AnyAssessmentResult) : null;
  } catch {
    result = null;
  }
  cache.set(type, result);
  return result;
}

export function clearAssessmentResult(type: AssessmentType): void {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(STORAGE_PREFIX + type);
    } catch {
      // no-op
    }
  }
  cache.set(type, null);
  notifyListeners();
}

/** Subscribes to result changes; for use with useSyncExternalStore. */
export function subscribeAssessmentResults(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
