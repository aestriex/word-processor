import { z } from 'zod';

export const ConfigSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  autosaveIntervalMs: z.number().default(5000),
  editor: z.object({
    defaultFontFamily: z.string().default('system-ui'),
    defaultFontSize: z.number().default(16),
  }).default({
    defaultFontFamily: 'system-ui',
    defaultFontSize: 16,
  }),
  keybindings: z.object({
    save: z.string().default('ctrl+s'),
  }).default({
    save: 'ctrl+s',
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export const DEFAULT_CONFIG: Config = ConfigSchema.parse({});
