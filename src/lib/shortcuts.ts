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
  { id: 'strike', label: 'Strikethrough', keys: 'ctrl+shift+x', source: 'hardcoded' },
  { id: 'undo', label: 'Undo', keys: 'ctrl+z', source: 'hardcoded' },
  { id: 'redo', label: 'Redo', keys: 'ctrl+y', source: 'hardcoded' },
  { id: 'insertPageBreak', label: 'Insert Page Break', keys: 'ctrl+enter', source: 'hardcoded' },
  { id: 'insertLink', label: 'Hyperlink', keys: 'ctrl+k', source: 'hardcoded' },

  // Paragraphs

  { id: 'alignLeft', label: 'Align Left', keys: 'ctrl+shift+l', source: 'hardcoded' },
  { id: 'alignCenter', label: 'Align Center', keys: 'ctrl+shift+e', source: 'hardcoded' },
  { id: 'alignRight', label: 'Align Right', keys: 'ctrl+shift+r', source: 'hardcoded' },
  { id: 'alignJustify', label: 'Justify', keys: 'ctrl+shift+j', source: 'hardcoded' },
  { id: 'unorderedList', label: 'Bullet List', keys: 'ctrl+shift+8', source: 'hardcoded' },
  { id: 'orderedList', label: 'Numbered List', keys: 'ctrl+shift+7', source: 'hardcoded' },
  { id: 'increaseIndent', label: 'Increase Indent', keys: 'ctrl+]', source: 'hardcoded' },
  { id: 'decreaseIndent', label: 'Decrease Indent', keys: 'ctrl+[', source: 'hardcoded' },
  { id: 'clearFormatting', label: 'Clear Formatting', keys: 'ctrl+\\', source: 'hardcoded' },
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

export function formatShortcutParts(shortcut: string): string[] {
  return shortcut.split('+').map((part) => {
    if (part === 'ctrl') return 'Ctrl';
    if (part === 'shift') return 'Shift';
    if (part === 'alt') return 'Alt';
    if (part === 'meta') return 'Cmd';
    return part.toUpperCase();
  });
}
