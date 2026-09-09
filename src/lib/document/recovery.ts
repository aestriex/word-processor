import { writeTextFile, exists, mkdir, remove } from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import type { Editor } from '@tiptap/core';
import { CURRENT_DOCUMENT_VERSION, type DocumentFile } from './schema';

const RECOVERY_FILENAME = 'autosave.wpdoc';

// NOTE: single fixed recovery slot — assumes one open document at a time.
// Will need revisiting once multi-document/split-view (M4) exists.
async function getRecoveryPath(): Promise<string> {
  const dir = await appDataDir();
  const recoveryDir = await join(dir, 'recovery');
  if (!(await exists(recoveryDir))) {
    await mkdir(recoveryDir, { recursive: true });
  }
  return join(recoveryDir, RECOVERY_FILENAME);
}

export async function saveRecoveryCopy(editor: Editor, originalPath: string | null): Promise<void> {
  try {
    const file: DocumentFile = {
      version: CURRENT_DOCUMENT_VERSION,
      docJSON: editor.getJSON(),
      metadata: {
        modifiedAt: new Date().toISOString(),
        originalPath: originalPath ?? undefined,
      },
    };
    const path = await getRecoveryPath();
    await writeTextFile(path, JSON.stringify(file, null, 2));
  } catch (err) {
    console.error('Autosave failed:', err);
  }
}

export async function clearRecoveryCopy(): Promise<void> {
  try {
    const path = await getRecoveryPath();
    if (await exists(path)) {
      await remove(path);
    }
  } catch (err) {
    console.error('Failed to clear recovery copy:', err);
  }
}
