import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { IconButton } from "../../../IconButton";
import { GitCompare, History, MessagesSquare } from "lucide-react";

export function TrackingGroup() {
  return (
    <RibbonGroup>
      <IconButton label="Track Changes" icon={<History size={16} />} onClick={() => {}} disabled />
      <IconButton label="Track Comments" icon={<MessagesSquare size={16} />} onClick={() => {}} disabled />
      <IconButton label="Compare Documents" icon={<GitCompare size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
