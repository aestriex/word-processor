import { useConfigStore } from './config/store';
import { getEffectiveKeybinding } from './shortcuts';

export function useShortcutDisplay(id: string): string | null {
  const keybindings = useConfigStore((s) => s.config.keybindings);
  const binding = getEffectiveKeybinding(keybindings, id);
  return binding || null;
}
