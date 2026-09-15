import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { NonPrintingCharsToggle } from "../NPCToggle";
import { RibbonIconButton } from "../../RibbonIconButton";
import { Sparkles } from "lucide-react";

export function DisplayGroup() {
  return (
    <RibbonGroup showSeparator={false}>
      <NonPrintingCharsToggle />
      <RibbonIconButton label="Document Statistics" icon={<Sparkles size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
