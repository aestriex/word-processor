import { create } from 'zustand';

interface SearchUIState {
  isOpen: boolean;
  searchTerm: string;
  replaceTerm: string;
  caseSensitive: boolean;
  useRegex: boolean;
  /** bumped whenever something wants to force-refocus whichever search
   *  input is currently visible (popup or sidebar), even if it was already
   *  open — e.g. pressing Ctrl+F again while the sidebar already has focus
   *  elsewhere in the document. */
  focusToken: number;

  /** Opens the popup (used by Ctrl+F when no search UI is active yet). */
  open: () => void;
  /** Fully done searching: hides popup AND resets the query/replace text
   *  and (via the caller) document decorations. Used by the popup's own
   *  close button and by Escape. */
  close: () => void;
  /** Hides the popup WITHOUT resetting search state — used when handing
   *  off to the Advanced sidebar, so the query/toggles carry over rather
   *  than the user having to re-type them. */
  hide: () => void;
  bumpFocus: () => void;
  setSearchTerm: (term: string) => void;
  setReplaceTerm: (term: string) => void;
  toggleCaseSensitive: () => void;
  toggleUseRegex: () => void;
}

export const useSearchStore = create<SearchUIState>((set) => ({
  isOpen: false,
  searchTerm: '',
  replaceTerm: '',
  caseSensitive: false,
  useRegex: false,
  focusToken: 0,

  open: () => set((s) => ({ isOpen: true, focusToken: s.focusToken + 1 })),
  close: () => set({ isOpen: false, searchTerm: '', replaceTerm: '' }),
  hide: () => set({ isOpen: false }),
  bumpFocus: () => set((s) => ({ focusToken: s.focusToken + 1 })),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setReplaceTerm: (term) => set({ replaceTerm: term }),
  toggleCaseSensitive: () => set((s) => ({ caseSensitive: !s.caseSensitive })),
  toggleUseRegex: () => set((s) => ({ useRegex: !s.useRegex })),
}));
