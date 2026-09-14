import { useEffect, useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RibbonIconInputProps {
  label: string;
  icon: ReactNode;
  value: number;
  onCommit: (value: number) => void;
  min?: number;
  max?: number;
  width?: string;
  showSteppers?: boolean;
  stepAmount?: number;
}

export function RibbonIconInput({
  label,
  icon,
  value,
  onCommit,
  min = 0,
  max = 9999,
  width = 'w-16',
  showSteppers = false,
  stepAmount = 1,
}: RibbonIconInputProps) {
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  function commit() {
    const num = Number(localValue);
    if (!Number.isNaN(num)) onCommit(num);
  }

  function step(delta: number) {
    const current = Number(localValue) || value;
    const next = Math.min(max, Math.max(min, current + delta));
    setLocalValue(String(next));
    onCommit(next);
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div className="relative flex h-8 items-stretch">
            <span className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
            <Input
                type="number"
                min={min}
                max={max}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commit();
                    e.currentTarget.blur();
                  } else if (showSteppers && e.key === 'ArrowUp') {
                    e.preventDefault();
                    step(stepAmount);
                  } else if (showSteppers && e.key === 'ArrowDown') {
                    e.preventDefault();
                    step(-stepAmount);
                  }
                }}
                className={`relative z-0 h-8 ${width} pl-6 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${showSteppers ? 'pr-5' : 'pr-2'}`}
              />

            {showSteppers && (
              <div className="absolute right-0 top-0 z-10 flex h-full w-5 flex-col">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-1/2 w-full flex-none items-end justify-center rounded-none p-0"
                  onClick={() => step(stepAmount)}
                  tabIndex={-1}
                >
                  <ChevronUp size={10} className="translate-y-px" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-1/2 w-full flex-none items-start justify-center rounded-none p-0"
                  onClick={() => step(-stepAmount)}
                  tabIndex={-1}
                >
                  <ChevronDown size={10} className="-translate-y-px" />
                </Button>
              </div>
            )}
          </div>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
