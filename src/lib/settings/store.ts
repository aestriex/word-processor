import { create } from 'zustand';

interface SettingsDialogStore {
  isOpen: boolean;
  activePanelId: string;
  open: (panelId?: string) => void;
  close: () => void;
  setActivePanel: (panelId: string) => void;
}

export const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
  isOpen: false,
  activePanelId: 'general',
  open: (panelId) => set((s) => ({ isOpen: true, activePanelId: panelId ?? s.activePanelId })),
  close: () => set({ isOpen: false }),
  setActivePanel: (panelId) => set({ activePanelId: panelId }),
}));
