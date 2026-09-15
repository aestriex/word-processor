import { Pencil } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ModeDropdown() {
  return (
    <Select value="editing" disabled>
      <Tooltip>
        <TooltipTrigger
          render={
            <span className="inline-flex">
              <SelectTrigger className="h-8 w-36 gap-1.5 text-sm">
                <Pencil size={14} className="text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
            </span>
          }
        />
        <TooltipContent>Editing mode</TooltipContent>
      </Tooltip>
      <SelectContent>
        <SelectItem value="editing">Editing</SelectItem>
        <SelectItem value="suggesting">Suggesting</SelectItem>
        <SelectItem value="viewing">Viewing</SelectItem>
      </SelectContent>
    </Select>
  );
}
