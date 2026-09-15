import { SeparatorHorizontal } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { IconButton } from '../../../IconButton';
import { PageBreakButton } from '../PageBreakButton';
import type { Editor } from '@tiptap/core';

export function BreaksGroup({ editor }: { editor: Editor }) {
  return (
    <RibbonGroup>
      <PageBreakButton editor={editor} />
      <IconButton
        label="Section Break"
        icon={<SeparatorHorizontal size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
