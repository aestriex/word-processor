import { useEffect, useState } from 'react';
import { useConfigStore } from '@/lib/config/store';

function getSystemPreference(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  const override = useConfigStore((s) => s.config.accessibility.reduceMotion);
  const [systemPref, setSystemPref] = useState(getSystemPreference);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setSystemPref(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  if (override === 'on') return true;
  if (override === 'off') return false;
  return systemPref;
}
