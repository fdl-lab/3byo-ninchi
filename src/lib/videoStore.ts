const VIDEO_KEY = "3byo-ninchi-video";
const RESULT_KEY = "3byo-ninchi-result";

export function saveVideoUrl(url: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(VIDEO_KEY, url);
}

export function getVideoUrl(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(VIDEO_KEY);
}

export function saveAnalysisResult(result: unknown): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function getAnalysisResult<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearVideoUrl(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(VIDEO_KEY);
}
