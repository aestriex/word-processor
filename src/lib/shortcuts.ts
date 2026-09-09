export interface ShortcutDefinition {
  id: string;
  label: string;
  keys: string;
  /** 'config' = reads from app-config, actually rebindable today.
   *  'hardcoded' = bound internally by a TipTap/ProseMirror extension;
   *  documented here for visibility, not yet rebindable (M2 #27). */
  source: 'config' | 'hardcoded';
  configPath?: string;
}

export const SHORTCUTS: ShortcutDefinition[] = [
  { id: 'save', label: 'Save', keys: 'ctrl+s', source: 'config', configPath: 'keybindings.save' },
  { id: 'bold', label: 'Bold', keys: 'ctrl+b', source: 'hardcoded' },
  { id: 'italic', label: 'Italic', keys: 'ctrl+i', source: 'hardcoded' },
  { id: 'underline', label: 'Underline', keys: 'ctrl+u', source: 'hardcoded' },
  { id: 'strike', label: 'Strikethrough', keys: 'ctrl+shift+s', source: 'hardcoded' },
  { id: 'undo', label: 'Undo', keys: 'ctrl+z', source: 'hardcoded' },
  { id: 'redo', label: 'Redo', keys: 'ctrl+y', source: 'hardcoded' },
];

export function matchesShortcut(e: KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut.toLowerCase().split('+');
  const key = parts.pop();
  return (
    (e.ctrlKey || e.metaKey) === parts.includes('ctrl') &&
    e.shiftKey === parts.includes('shift') &&
    e.altKey === parts.includes('alt') &&
    e.key.toLowerCase() === key
  );
}

// Sanity check: no two entries should claim the same key combo.
export function findShortcutConflicts(): string[][] {
  const seen = new Map<string, string[]>();
  for (const s of SHORTCUTS) {
    const list = seen.get(s.keys) ?? [];
    list.push(s.id);
    seen.set(s.keys, list);
  }
  return [...seen.values()].filter((ids) => ids.length > 1);
}
