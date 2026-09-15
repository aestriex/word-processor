import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { RibbonIconButton } from "../../RibbonIconButton";
import { FileSearchCorner, TextSearch } from "lucide-react";

export function SearchGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton label="Find & Replace" icon={<FileSearchCorner size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Find in All Open Documents" icon={<TextSearch size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
