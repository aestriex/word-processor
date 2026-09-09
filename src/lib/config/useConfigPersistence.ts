import { useEffect, useRef } from 'react';
import { useConfigStore } from './store';
import { loadConfigFromDisk, saveConfigToDisk } from './persistence';

export function useConfigPersistence() {
  const config = useConfigStore((s) => s.config);
  const loadConfig = useConfigStore((s) => s.loadConfig);
  const hasLoaded = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from disk once, on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await loadConfigFromDisk();
        loadConfig(raw);
      } catch (err) {
        console.error('Failed to load config from disk:', err);
      } finally {
        hasLoaded.current = true;
      }
    })();
  }, [loadConfig]);

  // Save to disk (debounced) whenever config changes, after initial load
  useEffect(() => {
    if (!hasLoaded.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveConfigToDisk(config);
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [config]);
}
