import { z } from 'zod';

export const CURRENT_DOCUMENT_VERSION = 1;

export const DocumentFileSchema = z.object({
  version: z.number(),
  docJSON: z.any(),
  metadata: z.object({
    title: z.string().optional(),
    createdAt: z.string().optional(),
    modifiedAt: z.string().optional(),
  }).default({}),
});

export type DocumentFile = z.infer<typeof DocumentFileSchema>
