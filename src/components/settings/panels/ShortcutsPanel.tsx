import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useConfigStore } from '@/lib/config/store';
import {
  SHORTCUTS,
  getEffectiveKeybinding,
  findLiveConflict,
  captureShortcutString,
  formatShortcutParts,
  type ShortcutDefinition,
} from '@/lib/shortcuts';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { IconButton } from '@/components/layout/IconButton';
import { SettingsSection } from '@/components/settings/SettingsSection';
import type { SettingsSectionDefinition } from '@/lib/settings/types';

const CATEGORY_ORDER = ['General', 'Search', 'Formatting', 'Paragraphs', 'Insert'];

// Reused by SettingsDialog's nav for scroll-spy — same grouping drives
// both, so they can never drift out of sync with each other.
export const SHORTCUTS_PANEL_SECTIONS: SettingsSectionDefinition[] = CATEGORY_ORDER.map((c) => ({
  id: c,
  label: c,
}));

function groupByCategory(defs: ShortcutDefinition[]): [string, ShortcutDefinition[]][] {
  const groups = new Map<string, ShortcutDefinition[]>();
  for (const def of defs) {
    const list = groups.get(def.category) ?? [];
    list.push(def);
    groups.set(def.category, list);
  }
  const ordered: [string, ShortcutDefinition[]][] = [];
  for (const cat of CATEGORY_ORDER) {
    if (groups.has(cat)) {
      ordered.push([cat, groups.get(cat)!]);
      groups.delete(cat);
    }
  }
  for (const [cat, list] of groups) ordered.push([cat, list]);
  return ordered;
}

function ShortcutRow({ def }: { def: ShortcutDefinition }) {
  const keybindings = useConfigStore((s) => s.config.keybindings);
  const setKeybinding = useConfigStore((s) => s.setKeybinding);
  const resetKeybinding = useConfigStore((s) => s.resetKeybinding);

  const [isRecording, setIsRecording] = useState(false);
  const [conflict, setConflict] = useState<{ otherId: string; otherLabel: string; keys: string } | null>(null);

  const current = getEffectiveKeybinding(keybindings, def.id);
  const isDefault = current === def.keys;
  const isLocked = def.context === 'os';

  useEffect(() => {
    if (!isRecording) return;

    function handleKeyDown(e: KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setIsRecording(false);
        return;
      }

      const captured = captureShortcutString(e);
      if (!captured) return;

      const conflictDef = findLiveConflict(keybindings, def.id, captured);
      if (conflictDef) {
        setConflict({ otherId: conflictDef.id, otherLabel: conflictDef.label, keys: captured });
        setIsRecording(false);
        return;
      }

      setKeybinding(def.id, captured);
      setIsRecording(false);
    }

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isRecording, keybindings, def.id, setKeybinding]);

  const handleSwap = () => {
    if (!conflict) return;
    // Give the OTHER command whatever binding this row currently has,
    // rather than leaving it fully unbound — this is exactly the bug
    // that made Find & Replace silently stop working: the old
    // "Overwrite" set the loser to '' with zero indication anything had
    // happened. A swap guarantees both commands always keep SOME
    // binding, so this failure mode can't recur.
    setKeybinding(conflict.otherId, current);
    setKeybinding(def.id, conflict.keys);
    setConflict(null);
  };

  return (
    <div className="flex flex-col gap-1 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">{def.label}</span>

        <div className="flex items-center gap-2">
          {isLocked ? (
            <>
              <KbdGroup>
                {formatShortcutParts(current).map((part, i) => (
                  <Kbd key={i}>{part}</Kbd>
                ))}
              </KbdGroup>
              <span className="text-xs text-muted-foreground">System</span>
            </>
          ) : (
            <>
              {isRecording ? (
                <span className="text-xs italic text-muted-foreground">Press a key combination… (Esc to cancel)</span>
              ) : current ? (
                <KbdGroup>
                  {formatShortcutParts(current).map((part, i) => (
                    <Kbd key={i}>{part}</Kbd>
                  ))}
                </KbdGroup>
              ) : (
                <span className="text-xs text-muted-foreground">Unbound</span>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setConflict(null);
                  setIsRecording(true);
                }}
                disabled={isRecording}
              >
                Change
              </Button>

              <span className="inline-flex">
                <IconButton
                  label="Reset to default"
                  icon={<RotateCcw className="h-3.5 w-3.5" />}
                  onClick={() => resetKeybinding(def.id)}
                  disabled={isDefault}
                />
              </span>
            </>
          )}
        </div>
      </div>

      {conflict && (
        <div className="flex items-center justify-between rounded-md bg-amber-500/10 px-2 py-1.5 text-xs text-amber-700 dark:text-amber-400">
          <span>
            <KbdGroup>
              {formatShortcutParts(conflict.keys).map((part, i) => (
                <Kbd key={i}>{part}</Kbd>
              ))}
            </KbdGroup>{' '}
            is already used by <strong>{conflict.otherLabel}</strong>.
          </span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setConflict(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="secondary" onClick={handleSwap}>
              Swap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ShortcutsPanel() {
  const resetAllKeybindings = useConfigStore((s) => s.resetAllKeybindings);
  const groups = groupByCategory(SHORTCUTS);

  const handleResetAll = () => {
    if (window.confirm('Reset all keyboard shortcuts to their defaults?')) {
      resetAllKeybindings();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {groups.map(([category, defs]) => (
        <SettingsSection key={category} id={category} title={category}>
          {defs.map((def) => (
            <ShortcutRow key={def.id} def={def} />
          ))}
        </SettingsSection>
      ))}

      <div className="flex justify-end border-t border-border pt-4">
        <Button variant="outline" size="sm" onClick={handleResetAll}>
          Reset all to defaults
        </Button>
      </div>
    </div>
  );
}
