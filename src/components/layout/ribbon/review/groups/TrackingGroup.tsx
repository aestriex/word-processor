import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { RibbonIconButton } from "../../RibbonIconButton";
import { GitCompare, History, MessagesSquare } from "lucide-react";

export function TrackingGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton label="Track Changes" icon={<History size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Track Comments" icon={<MessagesSquare size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Compare Documents" icon={<GitCompare size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
