import { RibbonGroup } from '@/components/layout/RibbonGroup';
import { List, BookOpen, Image as ImageIcon, Table2, ScrollText, Library } from 'lucide-react';
import { RibbonIconButton } from '../../RibbonIconButton';

export function ReferenceTablesGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton label="Table of Contents" icon={<List size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Table of Figures" icon={<ImageIcon size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Table of Tables" icon={<Table2 size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Table of Authorities" icon={<ScrollText size={16} />} onClick={() => { }} disabled />
      <RibbonIconButton label="Index" icon={<BookOpen size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="References" icon={<Library size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
