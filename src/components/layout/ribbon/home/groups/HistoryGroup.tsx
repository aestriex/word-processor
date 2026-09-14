import { Undo2, Redo2 } from 'lucide-react';
import { useDocumentStore } from '@/lib/document/store';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function HistoryGroup() {
  const editor = useDocumentStore((s) => s.editor);
  if (!editor) return null;

  return (
    <RibbonGroup>
      <RibbonIconButton
        label="Undo"
        icon={<Undo2 size={16} />}
        onClick={() => editor.chain().focus().undo().run()}
        shortcutId="undo"
      />

      <RibbonIconButton
        label="Redo"
        icon={<Redo2 size={16} />}
        onClick={() => editor.chain().focus().redo().run()}
        shortcutId="redo"
      />
    </RibbonGroup>
  );
}
