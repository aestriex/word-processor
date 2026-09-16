import { Columns2, Printer } from 'lucide-react';
import { RibbonGroup } from '../../../RibbonGroup';
import { IconButton } from '../../../IconButton';

export function WindowGroup() {
  return (
    <RibbonGroup showSeparator={false}>
      <IconButton
        label="Split View"
        icon={<Columns2 size={16} />}
        onClick={() => {}}
        disabled
      />
      <IconButton
        label="Print Preview"
        icon={<Printer size={16} />}
        onClick={() => {}}
        disabled
      />
    </RibbonGroup>
  );
}
