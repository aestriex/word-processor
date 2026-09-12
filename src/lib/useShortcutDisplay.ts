import { useConfigStore } from './config/store';
import { SHORTCUTS } from './shortcuts';

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj);
}

export function useShortcutDisplay(id: string): string | null {
  const config = useConfigStore((s) => s.config);
  const def = SHORTCUTS.find((s) => s.id === id);
  if (!def) return null;

  if (def.source === 'config' && def.configPath) {
    const live = getByPath(config, def.configPath);
    if (typeof live === 'string') return live;
  }
  return def.keys;
}
