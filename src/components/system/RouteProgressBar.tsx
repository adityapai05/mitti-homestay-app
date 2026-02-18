"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const DONE_DELAY_MS = 180;
const SAFETY_TIMEOUT_MS = 4000;

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFirstRender = useRef(true);
  const isNavigatingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const stopAnimationLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const clearSafetyTimeout = useCallback(() => {
    if (safetyTimeoutRef.current !== null) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  const animateToEighty = useCallback(() => {
    stopAnimationLoop();

    const tick = () => {
      setProgress((current) => {
        if (current >= 80) return current;
        const next = current + (80 - current) * 0.08;
        return Math.min(80, next);
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [stopAnimationLoop]);

  const startProgress = useCallback(() => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;
    setVisible(true);
    setProgress(6);
    animateToEighty();

    // safety: never allow infinite loading bar
    clearSafetyTimeout();
    safetyTimeoutRef.current = window.setTimeout(() => {
      finishProgress();
    }, SAFETY_TIMEOUT_MS);
  }, [animateToEighty, clearSafetyTimeout]);

  const finishProgress = useCallback(() => {
    if (!isNavigatingRef.current) return;

    isNavigatingRef.current = false;
    stopAnimationLoop();
    clearSafetyTimeout();

    setProgress(100);

    window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, DONE_DELAY_MS);
  }, [stopAnimationLoop, clearSafetyTimeout]);

  // finish when route actually changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    finishProgress();
  }, [finishProgress, pathname, searchParams]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);

      // external links → ignore
      if (destination.origin !== current.origin) return;

      // SAME ROUTE CLICK (your bug)
      const isSameRoute =
        destination.pathname === current.pathname &&
        destination.search === current.search &&
        destination.hash === current.hash;

      if (isSameRoute) {
        finishProgress();
        return;
      }

      startProgress();
    };

    const onPopState = () => {
      startProgress();
    };

    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(
      window.history,
    );

    window.history.pushState = (...args: Parameters<History["pushState"]>) => {
      startProgress();
      return originalPushState(...args);
    };

    window.history.replaceState = (
      ...args: Parameters<History["replaceState"]>
    ) => {
      startProgress();
      return originalReplaceState(...args);
    };

    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      stopAnimationLoop();
      clearSafetyTimeout();
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("popstate", onPopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [startProgress, finishProgress, stopAnimationLoop, clearSafetyTimeout]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[120] h-1 w-full transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-mitti-brown transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
