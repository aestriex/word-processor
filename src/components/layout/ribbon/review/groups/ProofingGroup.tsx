import { RibbonGroup } from "@/components/layout/RibbonGroup";
import { RibbonIconButton } from "../../RibbonIconButton";
import { BookA, Info, Languages, SpellCheck } from "lucide-react";

export function ProofingGroup() {
  return (
    <RibbonGroup>
      <RibbonIconButton label="Spelling & Grammar" icon={<SpellCheck size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Dictionary" icon={<BookA size={16} />} onClick={() => {}} disabled />
      <RibbonIconButton label="Translate" icon={<Languages size={16} />} onClick={() => { }} disabled />
      <RibbonIconButton label="Document Properties" icon={<Info size={16} />} onClick={() => { } } disabled />
    </RibbonGroup>
  );
}
