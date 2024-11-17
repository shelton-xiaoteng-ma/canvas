import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

interface TextSidebarProps {
  editor: Editor;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  return (
    <div
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "text" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Text" description="Add Text to your canvas" />
      <ScrollArea>
        <div className="p-4 space-y-6 border-b">
          <Button
            variant={"ghost"}
            className="w-full"
            onClick={() => editor?.addText()}
          >
            Add a textbox
          </Button>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("text")} />
    </div>
  );
};
