import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocumentStore } from "@/lib/document/store";
import { FileText } from "lucide-react";
import { FontGroup } from "./ribbon/groups/FontGroup";
import { TooltipProvider } from "../ui/tooltip";
import { ParagraphGroup } from "./ribbon/groups/ParagraphGroup";
import { HistoryGroup } from "./ribbon/groups/HistoryGroup";
import { StylesGroup } from "./ribbon/groups/StylesGroup";
import { ActionsGroup } from "./ribbon/groups/ActionsGroup";

const RIBBON_TABS = ["Home", "Insert", "Layout", "Review", "View"] as const;
type RibbonTab = (typeof RIBBON_TABS)[number];

export function Ribbon() {
  const [activeTab, setActiveTab] = useState<RibbonTab>("Home");
  const filePath = useDocumentStore((s) => s.filePath);
  const isDirty = useDocumentStore((s) => s.isDirty);
  const save = useDocumentStore((s) => s.save);
  const saveAs = useDocumentStore((s) => s.saveAs);
  const openFile = useDocumentStore((s) => s.openFile);

  const displayName = filePath ? filePath.split("/").pop() : "Untitled";

  const editor = useDocumentStore((s) => s.editor);
  if (!editor) return null;

  return (
    <TooltipProvider delay={300} closeDelay={0}>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as RibbonTab)}
        className="gap-0 bg-card border-b border-border"
      >
        <div className="relative h-10">
          <div className="relative z-10 flex h-10 items-center justify-between px-1">
            <div className="flex h-10 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 flex-none rounded-none px-3 text-primary hover:text-primary"
                    >
                      <FileText size={16} />
                    </Button>
                  }
                />
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={openFile}>Open…</DropdownMenuItem>
                  <DropdownMenuItem onClick={save}>Save</DropdownMenuItem>
                  <DropdownMenuItem onClick={saveAs}>Save As…</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TabsList
                variant="line"
                className="h-10 gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-10"
              >
                {RIBBON_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="h-10 flex-none rounded-none border-0 px-3 text-sm hover:bg-muted/50 data-active:hover:bg-muted/50 group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:h-0.5 after:bg-muted-foreground hover:after:opacity-100 data-active:after:bg-foreground"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <span className="pr-2 text-sm text-muted-foreground">
              {displayName}
              {isDirty ? " •" : ""}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-0.5 bg-border" />
        </div>

        <TabsContent value="Home" className="m-0 h-14 flex-none px-3">
          <div className="flex h-full items-center">
            <HistoryGroup />
            <StylesGroup editor={editor} />
            <FontGroup />
            <ParagraphGroup />
            <ActionsGroup editor={editor}  />
          </div>
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
}
