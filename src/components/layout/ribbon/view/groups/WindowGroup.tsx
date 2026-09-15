import { Columns2, Printer } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { RibbonIconButton } from '../../RibbonIconButton';

export function WindowGroup() {
  return (
    <RibbonGroup showSeparator={false}>
      <RibbonIconButton
        label="Split View"
        icon={<Columns2 size={16} />}
        onClick={() => {}}
        disabled
      />
      <RibbonIconButton
        label="Print Preview"
        icon={<Printer size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
