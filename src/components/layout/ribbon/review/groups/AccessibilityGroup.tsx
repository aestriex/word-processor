import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { IconButton } from "../../../IconButton";
import { PersonStanding } from "lucide-react";

export function AccessibilityGroup() {
  return (
    <RibbonGroup>
      <IconButton label="Accessibility Check" icon={<PersonStanding size={16} />} onClick={() => {}} disabled />
    </RibbonGroup>
  );
}
