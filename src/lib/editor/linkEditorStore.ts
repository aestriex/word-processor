import { create } from 'zustand';

interface LinkEditorStore {
  /** Bumped to trigger opening the link editor — either onto an existing
   *  link at the current cursor/selection (jumps straight to edit view),
   *  or a brand-new blank insert form if there isn't one. Triggered by
   *  Ctrl+K (via DynamicShortcutsExtension) and by LinkButton (Ribbon +
   *  FloatingToolbar, same shared component). A counter rather than a
   *  boolean so pressing Ctrl+K again while it's already open still
   *  re-triggers (e.g. re-checks the cursor's current position). */
  insertRequestId: number;
  /** Bumped to force-close, regardless of current state — used by the
   *  popover's own Cancel/Save/X/Escape handlers. */
  closeRequestId: number;
  requestInsert: () => void;
  requestClose: () => void;
}

export const useLinkEditorStore = create<LinkEditorStore>((set) => ({
  insertRequestId: 0,
  closeRequestId: 0,
  requestInsert: () => set((s) => ({ insertRequestId: s.insertRequestId + 1 })),
  requestClose: () => set((s) => ({ closeRequestId: s.closeRequestId + 1 })),
}));
