import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Editor } from "@tiptap/core";
import { useShortcutDisplay } from "@/lib/useShortcutDisplay";
import { formatShortcutParts } from "@/lib/shortcuts"
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface ListStyleOption {
  value: string;
  label: string;
  sample: string;
}

interface ListStyleButtonProps {
  editor: Editor;
  label: string;
  icon: React.ReactNode;
  nodeName: "orderedList" | "unorderedList";
  options: ListStyleOption[];
  shortcutId?: string;
}

export function ListStyleButton({
  editor,
  label,
  icon,
  nodeName,
  options,
  shortcutId
}: ListStyleButtonProps) {
  const isActive = editor.isActive(nodeName);
  const shortcut = shortcutId ? useShortcutDisplay(shortcutId) : null;

  function applyStyle(style: string) {
    if (!editor.isActive(nodeName)) {
      const toggle =
        nodeName === "orderedList" ? "toggleOrderedList" : "toggleBulletList";
      editor.chain().focus()[toggle]().run();
    }
    editor
      .chain()
      .focus()
      .updateAttributes(nodeName, { listStyleType: style })
      .run();
  }

  return (
    <div className="flex items-stretch">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="icon-sm"
              className="h-8 rounded-r-none"
              onClick={() => {
                const toggle =
                  nodeName === "orderedList"
                    ? "toggleOrderedList"
                    : "toggleBulletList";
                editor.chain().focus()[toggle]().run();
              }}
            >
              {icon}
            </Button>
          }
        />
        <TooltipContent className="flex items-center gap-2">
          <span>{label}</span>
          {shortcut && (
            <KbdGroup>
              {formatShortcutParts(shortcut).map((part, i) => (
                <Kbd key={i}>{part}</Kbd>
              ))}
            </KbdGroup>
          )}
        </TooltipContent>
      </Tooltip>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-8 w-4 rounded-l-none "
            >
              <ChevronDown size={10} />
            </Button>
          }
        />
        <PopoverContent className="w-40 p-1">
          <div className="flex flex-col gap-0.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                className="flex items-center justify-between rounded px-2 py-1 text-sm hover:bg-muted"
                onClick={() => applyStyle(opt.value)}
              >
                <span>{opt.label}</span>
                <span className="text-muted-foreground">{opt.sample}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
