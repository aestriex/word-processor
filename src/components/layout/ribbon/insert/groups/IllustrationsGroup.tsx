import { Table, Image as ImageIcon, PaintbrushVertical } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { RibbonGroup } from '@/components/layout/RibbonGroup';
import { IconButton } from '../../../IconButton';

export function IllustrationsGroup({}: { editor: Editor }) {
  return (
    <RibbonGroup>
      <IconButton
        label="Table"
        icon={<Table size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Image"
        icon={<ImageIcon size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Drawing"
        icon={<PaintbrushVertical size={16} />}
        onClick={() => { }}
        disabled
        />
    </RibbonGroup>
  );
}
