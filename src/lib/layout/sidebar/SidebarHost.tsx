import { type ReactNode, useRef } from 'react';
import { cn } from 'cn';
import { useSidebarStore, type SidebarAnchor } from '@/lib/layout/sidebarStore';
import { useImperativeSlide } from '@/lib/layout/useImperativeSlide';
import { useReducedMotion } from '@/lib/accessibility/useReducedMotion';

// TODO(#NN): re-enable the animated slide once the WebKitGTK
// layout-thrash issue is resolved. Animating a real box-offset property
// (right/left/bottom, required to avoid an earlier, worse transform-based
// race — see useImperativeSlide's doc comment for the full history)
// forces a real reflow every frame, which was observed to visibly jostle
// the document's own page-centering mid-animation — a symptom of this
// project's already-known pagination layout fragility (see #45), not a
// new bug in the sidebar itself. Shipping instant open/close for now
// makes that entire bug family structurally impossible rather than
// chasing a fifth timing fix. Revisit once smooth animation can be
// tested against a less reflow-sensitive layout, and/or on
// non-WebKitGTK platforms.
const SIDEBAR_ANIMATION_DISABLED = true;

const ANCHOR_POSITION_CLASS: Record<SidebarAnchor, string> = {
  left: 'inset-y-0 w-96 border-r',
  right: 'inset-y-0 w-96 border-l',
  bottom: 'inset-x-0 h-72 border-t',
};

interface SidebarHostProps {
  id: string;
  anchor: SidebarAnchor;
  children: ReactNode;
}

/**
 * Generic docked-panel chrome. Must be rendered inside a `relative`
 * (or otherwise positioned) ancestor bounded to exactly the area it
 * should occupy — in practice, the wrapper in App.tsx spanning the space
 * between the Ribbon and StatusBar.
 */
export function SidebarHost({ id, anchor, children }: SidebarHostProps) {
  const active = useSidebarStore((s) => s.active);
  const isOpen = active?.id === id && active.anchor === anchor;
  const ref = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  useImperativeSlide({
    ref,
    isOpen,
    anchor,
    reduceMotion: prefersReducedMotion || SIDEBAR_ANIMATION_DISABLED,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-30 flex flex-col bg-background border-border',
        ANCHOR_POSITION_CLASS[anchor],
        !isOpen && 'pointer-events-none',
      )}
      aria-hidden={!isOpen}
    >
      {children}
    </div>
  );
}
