import { Columns2, ListOrdered } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { IconButton } from '../../../IconButton';

export function ArrangeGroup() {
  return (
    <RibbonGroup showSeparator={false}>
      <IconButton label="Columns" icon={<Columns2 size={16} />} onClick={() => {}} disabled />
      <IconButton label="Line Numbers" icon={<ListOrdered size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
