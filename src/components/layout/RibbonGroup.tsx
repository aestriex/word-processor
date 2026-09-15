import type { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface RibbonGroupProps {
  children: ReactNode;
  showSeparator?: boolean;
}

export function RibbonGroup({ children, showSeparator = true }: RibbonGroupProps) {
  return (
    <div className="flex h-14 items-center">
      <div className="flex items-center gap-1">{children}</div>
      {showSeparator && <Separator orientation="vertical" className="mx-2 h-8 self-auto" />}
    </div>
  );
}
