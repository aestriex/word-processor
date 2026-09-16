import { useLayoutEffect, useRef } from 'react';
import type { SidebarAnchor } from '@/lib/layout/sidebarStore';

interface UseImperativeSlideOptions {
  ref: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  anchor: SidebarAnchor;
  durationMs?: number;
  /** Skip the animation entirely and snap straight to the target position.
   *  Driven by prefers-reduced-motion / an app accessibility setting. */
  reduceMotion?: boolean;
}

const OFFSET_PROPERTY: Record<SidebarAnchor, 'right' | 'left' | 'bottom'> = {
  right: 'right',
  left: 'left',
  bottom: 'bottom',
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Drives the sidebar's open/close slide by writing a real CSS box-offset
 * property (`right`/`left`/`bottom`, matching the dock anchor) via rAF —
 * NOT `transform`, and not a CSS `transition`.
 *
 * History (why this version looks the way it does): two earlier
 * approaches were tried and both had real, confirmed problems on this
 * dev machine's WebKitGTK:
 *   1. A CSS `transition` on `transform` could stall mid-flight when
 *      nothing else was generating paint/input activity.
 *   2. Switching to rAF-driven `transform` writes fixed the mid-flight
 *      stall, but every open/close cycle still switched between two
 *      different positioning mechanisms — `transform` while animating,
 *      plain static position at rest (transform cleared to '') — because
 *      leaving a non-`none` transform at rest broke Tooltip/Popover
 *      `position: fixed` math for anything mounted inside the panel.
 *      That mechanism-switch, on every single open, was itself a race
 *      WebKitGTK didn't always resolve correctly — the same general
 *      "layout-settling timing" class of issue already documented
 *      elsewhere in this project (pagination).
 *
 * This version uses the SAME property, `right`/`left`/`bottom`, for both
 * animating and resting — nothing to switch, nothing to race. Tradeoff:
 * forces real layout+paint each frame instead of a compositor-only
 * transform move. Accepted deliberately: short (~200ms), infrequent,
 * single-panel animation — correctness matters far more here than the
 * small perf cost, and this is not the same category of risk as this
 * project's known large-document performance issues (#45).
 */
export function useImperativeSlide({
  ref,
  isOpen,
  anchor,
  durationMs = 200,
  reduceMotion = false,
}: UseImperativeSlideOptions) {
  const rafRef = useRef<number | null>(null);
  const currentValueRef = useRef<number | null>(null); // null = not yet initialized

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const property = OFFSET_PROPERTY[anchor];
    const size = anchor === 'bottom' ? el.offsetHeight : el.offsetWidth;
    const hiddenValue = -size;
    const write = (value: number) => {
      el.style.setProperty(property, `${value}px`);
    };

    if (currentValueRef.current === null) {
      currentValueRef.current = isOpen ? 0 : hiddenValue;
      write(currentValueRef.current);
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const from = currentValueRef.current;
    const to = isOpen ? 0 : hiddenValue;
    const distance = to - from;

    if (distance === 0) return;

    if (reduceMotion) {
      currentValueRef.current = to;
      write(to);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(t);
      const value = from + distance * eased;
      currentValueRef.current = value;
      write(value);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        currentValueRef.current = to;
        write(to);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reduceMotion]);
}
