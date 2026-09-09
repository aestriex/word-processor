import { z } from 'zod';

export const ConfigSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  autosaveIntervalMs: z.number().default(30000),
  editor: z.object({
    defaultFontFamily: z.string().default('system-ui'),
    defaultFontSize: z.number().default(16),
  }).default({
    defaultFontFamily: 'system-ui',
    defaultFontSize: 16
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export const DEFAULT_CONFIG: Config = ConfigSchema.parse({});
