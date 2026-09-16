import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocumentStore } from "@/lib/document/store";
import { FontGroup } from "./ribbon/home/groups/FontGroup";
import { TooltipProvider } from "../ui/tooltip";
import { ParagraphGroup } from "./ribbon/home/groups/ParagraphGroup";
import { HistoryGroup } from "./ribbon/home/groups/HistoryGroup";
import { StylesGroup } from "./ribbon/home/groups/StylesGroup";
import { ActionsGroup } from "./ribbon/home/groups/ActionsGroup";
import { PagesGroup } from "./ribbon/insert/groups/PagesGroup";
import { IllustrationsGroup } from "./ribbon/insert/groups/IllustrationsGroup";
import { ReferenceTablesGroup } from "./ribbon/insert/groups/ReferenceTablesGroup";
import { TextGroup } from "./ribbon/insert/groups/TextGroup";
import { PageSetupGroup } from "./ribbon/layout/groups/PageSetupGroup";
import { ParagraphSpacingGroup } from "./ribbon/layout/groups/SpacingGroup";
import { ArrangeGroup } from "./ribbon/layout/groups/ArrangeGroup";
import { BreaksGroup } from "./ribbon/insert/groups/BreaksGroup";
import { TensorLogo } from "../icons/TensorIcon";
import { ProofingGroup } from "./ribbon/review/groups/ProofingGroup";
import { AccessibilityGroup } from "./ribbon/review/groups/AccessibilityGroup";
import { SearchGroup } from "./ribbon/review/groups/SearchGroup";
import { TrackingGroup } from "./ribbon/review/groups/TrackingGroup";
import { DisplayGroup } from "./ribbon/review/groups/DisplayGroup";
import { DisplayModeGroup } from "./ribbon/view/groups/DisplayModeGroup";
import { ZoomGroup } from "./ribbon/view/groups/ZoomGroup";
import { ShowGroup } from "./ribbon/view/groups/ShowGroup";
import { ModeGroup } from "./ribbon/view/groups/ModeGroup";
import { WindowGroup } from "./ribbon/view/groups/WindowGroup";
import { useConfigStore } from "@/lib/config/store";
import { useSettingsDialogStore } from "@/lib/settings/store";

const RIBBON_TABS = ["Home", "Insert", "Layout", "Review", "View"] as const;
type RibbonTab = (typeof RIBBON_TABS)[number];

export function Ribbon() {
  const [activeTab, setActiveTab] = useState<RibbonTab>("Home");
  const filePath = useDocumentStore((s) => s.filePath);
  const isDirty = useDocumentStore((s) => s.isDirty);
  const save = useDocumentStore((s) => s.save);
  const saveAs = useDocumentStore((s) => s.saveAs);
  const openFile = useDocumentStore((s) => s.openFile);

  const showFloatingToolbar = useConfigStore((s) => s.config.useFloatingToolbar);

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
                      className="h-10 flex-none rounded-none px-3 text-primary text-sm hover:text-primary"
                    >
                      <TensorLogo size={16} />
                      Tensor
                    </Button>
                  }
                />
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={openFile}>Open…</DropdownMenuItem>
                  <DropdownMenuItem onClick={save}>Save</DropdownMenuItem>
                  <DropdownMenuItem onClick={saveAs}>Save As…</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => useSettingsDialogStore.getState().open()}>Settings</DropdownMenuItem>
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
            {!showFloatingToolbar && <ActionsGroup editor={editor} />}
          </div>
        </TabsContent>

        <TabsContent value="Insert" className="m-0 h-14 flex-none px-3">
          <div className="flex h-full items-center">
            <PagesGroup editor={editor} />
            <IllustrationsGroup editor={editor} />
            <ReferenceTablesGroup />
            <BreaksGroup editor={editor} />
            <TextGroup editor={editor} />
          </div>
        </TabsContent>

        <TabsContent value="Layout" className="m-0 h-14 flex-none px-3">
          <div className="flex h-full items-center">
            <PageSetupGroup />
            <ParagraphSpacingGroup editor={editor} />
            <ArrangeGroup />
          </div>
        </TabsContent>

        <TabsContent value="Review" className="m-0 h-14 flex-none px-3">
          <div className="flex h-full items-center">
            <ProofingGroup />
            <AccessibilityGroup />
            <SearchGroup />
            <TrackingGroup />
            <DisplayGroup />
          </div>
        </TabsContent>

        <TabsContent value="View" className="m-0 h-14 flex-none px-3">
          <div className="flex h-full items-center">
            <DisplayModeGroup />
            <ZoomGroup />
            <ShowGroup />
            <ModeGroup />
            <WindowGroup />
          </div>
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
}
