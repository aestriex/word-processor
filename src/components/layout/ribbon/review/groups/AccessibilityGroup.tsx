import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { RibbonIconButton } from "../../RibbonIconButton";
import { PersonStanding } from "lucide-react";

export function AccessibilityGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton label="Accessibility Check" icon={<PersonStanding size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
