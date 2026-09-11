import { z } from 'zod';
import { PAGE_GAP, DEFAULT_MARGINS } from '../pagination/constants';

export const ConfigSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'),
  autosaveIntervalMs: z.number().default(5000),
  editor: z.object({
    defaultFontFamily: z.string().default('system-ui'),
    defaultFontSize: z.number().default(16),
    defaultPageLayout: z.string().default('Pages'),
    defaultPageSize: z.string().default('Letter'),
    defaultPageGap: z.number().default(PAGE_GAP),
    defaultMargins: z.object({
      top: z.number(),
      bottom: z.number(),
      left: z.number(),
      right: z.number(),
    }).default(DEFAULT_MARGINS),
  }).default({
    defaultFontFamily: 'system-ui',
    defaultFontSize: 16,
    defaultPageLayout: 'Pages',
    defaultPageSize: 'Letter',
    defaultPageGap: PAGE_GAP,
    defaultMargins: DEFAULT_MARGINS,
  }),
  keybindings: z.object({
    save: z.string().default('ctrl+s'),
  }).default({
    save: 'ctrl+s',
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export const DEFAULT_CONFIG: Config = ConfigSchema.parse({});
