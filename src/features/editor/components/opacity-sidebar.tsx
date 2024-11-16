import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

interface OpacitySidebarProps {
  editor: Editor;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: OpacitySidebarProps) => {
  const activeOpacity = editor?.getActiveOpacity();
  const [opacity, setOpacity] = useState(editor?.getActiveOpacity());

  const onChangeOpacity = (opacity: number) => {
    editor?.changeOpacity(opacity);
    setOpacity(opacity);
  };

  useEffect(() => {
    setOpacity(activeOpacity);
  }, [activeOpacity]);

  return (
    <div
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "opacity" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Opacity"
        description="Modify opacity of your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-6 border-b">
          <Slider
            value={[opacity]}
            onValueChange={(values) => {
              onChangeOpacity(values[0]);
            }}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("stroke-width")} />
    </div>
  );
};
