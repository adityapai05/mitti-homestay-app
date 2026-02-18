"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  NAVIGATION_DONE,
  NAVIGATION_START,
  emitNavigationDone,
} from "@/lib/navigationEvents";

const DONE_DELAY_MS = 180;
const SAFETY_TIMEOUT_MS = 4000;

export default function RouteProgressBar() {
  const pathname = usePathname();

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
  }, [clearSafetyTimeout, stopAnimationLoop]);

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

    clearSafetyTimeout();
    safetyTimeoutRef.current = window.setTimeout(() => {
      finishProgress();
      emitNavigationDone();
    }, SAFETY_TIMEOUT_MS);
  }, [animateToEighty, clearSafetyTimeout, finishProgress]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    finishProgress();
    emitNavigationDone();
  }, [finishProgress, pathname]);

  useEffect(() => {
    const onNavigationStart = () => {
      startProgress();
    };

    const onNavigationDone = () => {
      finishProgress();
    };

    window.addEventListener(NAVIGATION_START, onNavigationStart);
    window.addEventListener(NAVIGATION_DONE, onNavigationDone);

    return () => {
      stopAnimationLoop();
      clearSafetyTimeout();
      window.removeEventListener(NAVIGATION_START, onNavigationStart);
      window.removeEventListener(NAVIGATION_DONE, onNavigationDone);
    };
  }, [clearSafetyTimeout, finishProgress, startProgress, stopAnimationLoop]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[200] h-1 w-full transition-opacity duration-200 ${
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
