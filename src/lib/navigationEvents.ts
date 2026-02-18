export const NAVIGATION_START = "mitti:navigation-start";
export const NAVIGATION_DONE = "mitti:navigation-done";

export function emitNavigationStart() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NAVIGATION_START));
}

export function emitNavigationDone() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NAVIGATION_DONE));
}
