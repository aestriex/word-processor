import { FileStack, Maximize, BookOpen } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function DisplayModeGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton
        label="Paginated / Pageless"
        icon={<FileStack size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Focus Mode"
        icon={<Maximize size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Reading Mode"
        icon={<BookOpen size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
