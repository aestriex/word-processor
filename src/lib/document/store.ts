import { create } from 'zustand';
import type { Editor } from '@tiptap/core';
import { saveDocument, saveDocumentAs, openDocument } from './fileOperations';
import { message } from '@tauri-apps/plugin-dialog';

interface DocumentStore {
  editor: Editor | null;
  filePath: string | null;
  isDirty: boolean;
  setEditor: (editor: Editor | null) => void;
  markDirty: () => void;
  save: () => Promise<void>;
  saveAs: () => Promise<void>;
  openFile: () => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  editor: null,
  filePath: null,
  isDirty: false,

  setEditor: (editor) => set({ editor }),
  markDirty: () => set({ isDirty: true }),

  save: async () => {
    const { editor, filePath } = get();
    if (!editor) return;
    if (!filePath) {
      await get().saveAs();
      return;
    }
    await saveDocument(editor, filePath);
    set({ isDirty: false });
  },

  saveAs: async () => {
    const { editor } = get();
    if (!editor) return;
    const path = await saveDocumentAs(editor);
    if (path) set({ filePath: path, isDirty: false });
  },

  openFile: async () => {
    const { editor } = get();
    if (!editor) return;
    try {
      const path = await openDocument(editor);
      if (path) set({ filePath: path, isDirty: false });
    } catch (err) {
      await message(err instanceof Error ? err.message : 'Failed to open document', {
        title: 'Error',
        kind: 'error',
      });
    }
  },
}));
