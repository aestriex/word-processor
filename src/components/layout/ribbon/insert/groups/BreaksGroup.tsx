import { SeparatorHorizontal } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';
import { PageBreakButton } from '../PageBreakButton';
import type { Editor } from '@tiptap/core';

export function BreaksGroup({ editor }: { editor: Editor }) {
  return (
    <RibbonGroup>
      <PageBreakButton editor={editor} />
      <RibbonIconButton
        label="Section Break"
        icon={<SeparatorHorizontal size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
