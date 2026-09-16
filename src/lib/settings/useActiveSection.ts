import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-spy: tracks which SettingsSection is most visible inside the
 * scrollable container right now, for highlighting the matching sub-nav
 * item. Picks whichever tracked section has the greatest intersection
 * ratio rather than "first intersecting entry" — more stable at
 * boundaries where two adjacent sections are both partially visible.
 */
export function useActiveSection(containerRef: React.RefObject<HTMLElement | null>, sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);
  const ratiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.sectionId;
          if (!id) continue;
          ratiosRef.current.set(id, entry.intersectionRatio);
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratiosRef.current.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const id of sectionIds) {
      const el = container.querySelector<HTMLElement>(`[data-section-id="${id}"]`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, sectionIds.join('|')]);

  return activeId;
}
