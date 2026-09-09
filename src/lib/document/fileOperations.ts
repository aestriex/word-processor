import { save, open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import type { Editor } from '@tiptap/core';
import { DocumentFileSchema, CURRENT_DOCUMENT_VERSION, type DocumentFile } from './schema';

const FILE_FILTERS = [{ name: 'Word Processor Document', extensions: ['wpdoc'] }];

export async function saveDocument(editor: Editor, filePath: string): Promise<void> {
  const file: DocumentFile = {
    version: CURRENT_DOCUMENT_VERSION,
    docJSON: editor.getJSON(),
    metadata: { modifiedAt: new Date().toISOString() },
  };
  await writeTextFile(filePath, JSON.stringify(file, null, 2));
}

export async function saveDocumentAs(editor: Editor): Promise<string | null> {
  const path = await save({ filters: FILE_FILTERS, defaultPath: 'Untitled.wpdoc' });
  if (!path) return null; // user cancelled the dialog
  await saveDocument(editor, path);
  return path;
}

export async function openDocument(editor: Editor): Promise<string | null> {
  const path = await open({ filters: FILE_FILTERS, multiple: false });
  if (!path || Array.isArray(path)) return null;

  const raw = await readTextFile(path);
  const parsed = JSON.parse(raw); // intentionally NOT try/caught — see note above
  const result = DocumentFileSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error('This file is not a valid document, or was saved by an incompatible version.');
  }

  editor.commands.setContent(result.data.docJSON);
  return path;
}
