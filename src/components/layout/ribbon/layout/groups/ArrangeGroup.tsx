import { Columns2, ListOrdered } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function ArrangeGroup() {
  return (
    <RibbonGroup showSeparator={false}>
      <RibbonIconButton label="Columns" icon={<Columns2 size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Line Numbers" icon={<ListOrdered size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
