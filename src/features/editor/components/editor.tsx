"use client";

import { useEditor } from "@/features/editor/hooks/use-editor";
import { Canvas } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActiveTool } from "../types";
import { Navbar } from "./navbar";
import { ShapeSidebar } from "./shape-sidebar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

export const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }

      if (tool === "draw") {
        // TODO: Enable draw mode
      }
      if (activeTool === "draw") {
        // TODO: disable draw mode
      }

      setActiveTool(tool);
    },
    [activeTool]
  );

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { init } = useEditor();

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current,
    });
    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar />
          <div
            className="h-[calc(100%-124px)] flex-1 bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Toolbar />
        </main>
      </div>
    </div>
  );
};
