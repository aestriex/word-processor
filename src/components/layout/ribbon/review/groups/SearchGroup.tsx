import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { IconButton } from "../../../IconButton";
import { FileSearchCorner, TextSearch } from "lucide-react";

export function SearchGroup() {
  return (
    <RibbonGroup>
      <IconButton label="Find & Replace" icon={<FileSearchCorner size={16} />} onClick={() => {}} disabled />
      <IconButton label="Find in All Open Documents" icon={<TextSearch size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
