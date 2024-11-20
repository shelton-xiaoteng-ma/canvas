"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Copy, Trash } from "lucide-react";
import { useCallback } from "react";
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import { ActiveTool, Editor } from "../types";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (value: ActiveTool) => void;
  key: string;
}

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const executeDuplicate = useCallback(async () => {
    await editor?.onCopy();
    await editor?.onPaste();
  }, [editor]);

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className="h-full flex items-center justify-center">
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("fill")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "fill" && "bg-gray-100")}
          >
            <div
              className="rounded-sm size-4 border"
              style={{
                backgroundColor: editor?.getActiveObjectFillColor(),
              }}
            />
          </Button>
        </Hint>
        <Hint label="Stroke Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("stroke-color")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "stroke-color" && "bg-gray-100")}
          >
            <div
              className="rounded-sm size-4 border-2 bg-white"
              style={{
                borderColor: editor?.getActiveObjectStrokeColor(),
              }}
            />
          </Button>
        </Hint>
        <Hint label="Stroke Width" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("stroke-width")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "stroke-width" && "bg-gray-100")}
          >
            <BsBorderWidth className="size-4" />
          </Button>
        </Hint>
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
        <Hint label="Change Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.delete()} size="icon" variant="ghost">
            <Trash className="size-4" />
          </Button>
        </Hint>
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={() => executeDuplicate()}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
