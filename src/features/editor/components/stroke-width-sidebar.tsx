import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

interface StrokeWidthSidebarProps {
  editor: Editor;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const widthValue = editor?.getActiveObjectStrokeWidth();
  const typeValue = editor?.getActiveObjectStrokeDashArray();

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeDashArray = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  return (
    <div
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "stroke-width" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Stroke Options"
        description="Modify stroke width of your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-6 border-b">
          <Label className="text-sm">Stroke Width</Label>
          <Slider
            value={[widthValue]}
            onValueChange={(value) => {
              onChangeStrokeWidth(value[0]);
            }}
          />
        </div>
        <div className="p-4 space-y-6 border-b">
          <Label className="text-sm">Stroke Type</Label>
          <Button
            onClick={() => {
              onChangeDashArray([]);
            }}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left",
              JSON.stringify(typeValue) === `[]` && "border-2 border-blue-500"
            )}
            style={{
              padding: "8px 16px ",
            }}
          >
            <div className="w-full border-black rounded-full border-4"></div>
          </Button>
          <Button
            onClick={() => {
              onChangeDashArray([5, 5]);
            }}
            variant="secondary"
            size="lg"
            className={cn(
              "w-full h-16 justify-start text-left",
              JSON.stringify(typeValue) === `[5,5]` &&
                "border-2 border-blue-500"
            )}
            style={{
              padding: "8px 16px ",
            }}
          >
            <div className="w-full border-black rounded-full border-4 border-dashed"></div>
          </Button>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("stroke-width")} />
    </div>
  );
};
