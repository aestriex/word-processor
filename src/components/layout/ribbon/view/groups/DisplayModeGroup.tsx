import { FileStack, Maximize, BookOpen } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { IconButton } from '../../../IconButton';

export function DisplayModeGroup() {
  return (
    <RibbonGroup>
      <IconButton
        label="Paginated / Pageless"
        icon={<FileStack size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Focus Mode"
        icon={<Maximize size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Reading Mode"
        icon={<BookOpen size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
