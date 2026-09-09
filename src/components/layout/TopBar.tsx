import { useConfigStore } from '../../lib/config/store';
import { useDocumentStore } from '../../lib/document/store';

export function TopBar() {
  const filePath = useDocumentStore((s) => s.filePath);
  const isDirty = useDocumentStore((s) => s.isDirty);
  const save = useDocumentStore((s) => s.save);
  const saveAs = useDocumentStore((s) => s.saveAs);
  const openFile = useDocumentStore((s) => s.openFile);

  const theme = useConfigStore((s) => s.config.theme);
  const setTheme = useConfigStore((s) => s.setTheme);

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-sm">
      <button onClick={openFile}>Open</button>
      <button onClick={save}>Save</button>
      <button onClick={saveAs}>Save As</button>
      <span className="ml-auto text-muted">
        {filePath ?? 'Untitled'}{isDirty ? ' •' : ''}
      </span>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded px-2 py-1 hover:bg-border"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
