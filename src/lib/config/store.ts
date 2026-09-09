import { create } from 'zustand';
import { ConfigSchema, DEFAULT_CONFIG, type Config } from './schema';

interface ConfigStore {
  config: Config;
  setTheme: (theme: Config['theme']) => void;
  loadConfig: (raw: unknown) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: DEFAULT_CONFIG,

  setTheme: (theme) =>
    set((state) => ({
      config: { ...state.config, theme },
    })),

  loadConfig: (raw) => {
    const result = ConfigSchema.safeParse(raw);
    if (result.success) {
      set({ config: result.data });
    } else {
      console.warn('Invalid config file, falling back to defaults', result.error);
      set({ config: DEFAULT_CONFIG });
    }
  },
}));
