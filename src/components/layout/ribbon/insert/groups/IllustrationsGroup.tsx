import { Table, Image as ImageIcon, PaintbrushVertical } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { RibbonGroup } from '@/components/layout/RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function IllustrationsGroup({}: { editor: Editor }) {
  return (
    <RibbonGroup>
      <RibbonIconButton
        label="Table"
        icon={<Table size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Image"
        icon={<ImageIcon size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Drawing"
        icon={<PaintbrushVertical size={16} />}
        onClick={() => { }}
        disabled
        />
    </RibbonGroup>
  );
}
