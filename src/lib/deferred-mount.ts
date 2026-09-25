/** Defer non-critical client work until after first paint / idle. */

export function scheduleDeferredMount(callback: () => void, timeoutMs = 2200): () => void {
  if (typeof window === "undefined") return () => undefined;

  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(id);
  }

  const timer = setTimeout(callback, Math.min(timeoutMs, 1500));
  return () => clearTimeout(timer);
}

export function scheduleAfterFirstPaint(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  let cancelled = false;
  const run = () => {
    if (!cancelled) callback();
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });

  return () => {
    cancelled = true;
  };
}
