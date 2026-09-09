import { useDocumentStore } from '../../lib/document/store';

export function TopBar() {
  const filePath = useDocumentStore((s) => s.filePath);
  const isDirty = useDocumentStore((s) => s.isDirty);

  return (
    <div className="relative flex items-center border-b border-border p-4 text-sm">
      <span className="absolute left-1/2 -translate-x-1/2 text-muted">
        {filePath ?? 'Untitled'}{isDirty ? ' •' : ''}
      </span>
    </div>
  );
}
