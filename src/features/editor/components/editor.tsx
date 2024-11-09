"use client";

import { useEditor } from "@/features/editor/hooks/use-editor";
import { Canvas } from "fabric";
import { useLayoutEffect, useRef } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

export const Editor = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { init } = useEditor();

  useLayoutEffect(() => {
    const canvas = new Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current,
    });
  }, [init]);
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar />
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
