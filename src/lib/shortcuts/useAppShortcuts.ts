import { useEffect } from 'react';
import { useConfigStore } from '@/lib/config/store';
import { useDocumentStore } from '@/lib/document/store';
import { useSettingsDialogStore } from '@/lib/settings/store';
import { getEffectiveKeybinding, matchesShortcut, SHORTCUTS } from '@/lib/shortcuts';

const APP_COMMAND_MAP: Record<string, () => boolean> = {
  save: () => {
    useDocumentStore.getState().save();
    return true;
  },
  openSettings: () => {
    useSettingsDialogStore.getState().open();
    return true;
  },
};

export function useAppShortcuts() {
  const keybindings = useConfigStore((s) => s.config.keybindings);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // While Settings is open, every app-level shortcut is suppressed —
      // closing is left entirely to the dialog's own X/Escape/overlay
      // click. Without this, e.g. Ctrl+S would silently save the
      // document in the background while just browsing preferences.
      if (useSettingsDialogStore.getState().isOpen) return;

      for (const def of SHORTCUTS) {
        if (def.context !== 'app') continue;
        const binding = getEffectiveKeybinding(keybindings, def.id);
        if (!binding || !matchesShortcut(e, binding)) continue;

        const handler = APP_COMMAND_MAP[def.id];
        if (handler?.()) {
          e.preventDefault();
          return;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keybindings]);
}
