import { create } from 'zustand';

export type SidebarAnchor = 'left' | 'right' | 'bottom';

interface ActiveSidebar {
  id: string;
  anchor: SidebarAnchor;
}

interface SidebarStore {
  active: ActiveSidebar | null;
  open: (id: string, anchor: SidebarAnchor) => void;
  close: () => void;
}

/**
 * Generic docked-panel state. Deliberately minimal: only one sidebar can be
 * open at a time, across the whole app, for now. This is the seed of a
 * future multi-panel/draggable/snapping system, but that's real
 * interaction-design work of its own — scope it as its own tracked issue
 * once a second real sidebar consumer exists and the actual requirements
 * (can two be open at once? per-anchor width memory? drag-to-redock?) are
 * known from real usage rather than guessed.
 */
export const useSidebarStore = create<SidebarStore>((set) => ({
  active: null,
  open: (id, anchor) => set({ active: { id, anchor } }),
  close: () => set({ active: null }),
}));
