"use client";

import { useEditor } from "@/features/editor/hooks/use-editor";
import { Canvas } from "fabric";
import { useEffect, useRef } from "react";

export const Editor = () => {
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
  }, [init]);
  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex-1 bg-muted" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
