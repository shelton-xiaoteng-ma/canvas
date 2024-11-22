import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { ActiveTool, Editor } from "../types";
import { ColorPicker } from "./color-picker";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

interface SettingsSidebarProps {
  editor: Editor;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingsSidebarProps) => {
  const workspace = editor?.getWorkspace();

  const initialSize = useMemo(() => {
    return {
      width: `${workspace?.width ?? 0}`,
      height: `${workspace?.height ?? 0}`,
    };
  }, [workspace]);
  const initialBackground = useMemo(
    () => (workspace?.fill as string) ?? "#ffffff",
    [workspace]
  );

  const [size, setSize] = useState(initialSize);
  const [background, setBackground] = useState(initialBackground);

  useEffect(() => {
    setSize(initialSize);
    setBackground(initialBackground);
  }, [initialBackground, initialSize]);

  const changeWidth = (value: string) => {
    setSize({ width: value, height: size["height"] });
  };
  const changeHeight = (value: string) => {
    setSize({ height: value, width: size["width"] });
  };
  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editor?.changeSize({
      width: parseInt(size["width"], 10),
      height: parseInt(size["height"], 10),
    });
  };

  return (
    <div
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "settings" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Settings" description="Workspace settings" />
      <ScrollArea>
        <form className="space-y-4 p-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              value={size["height"]}
              placeholder="Height"
              onChange={(e) => changeHeight(e.target.value)}
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label>Weight</Label>
            <Input
              value={size["width"]}
              placeholder="Width"
              onChange={(e) => changeWidth(e.target.value)}
              type="number"
            />
          </div>
          <Button className="w-full p-y-4" type="submit">
            Resize
          </Button>
          <div className="p-2">
            <Label>Background</Label>
            <ColorPicker value={background} onChange={changeBackground} />
          </div>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("settings")} />
    </div>
  );
};
