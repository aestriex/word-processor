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
