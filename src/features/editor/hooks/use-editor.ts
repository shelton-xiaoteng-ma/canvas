"use client";

import { Canvas, Rect, Shadow } from "fabric";
import { useCallback, useState } from "react";
import { useAutoResize } from "./use-auto-resize";

interface useEditorProps {
  initialCanvas: Canvas;
  initialContainer: HTMLDivElement | null;
}

export const useEditor = () => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({
    canvas,
    container,
  });

  const init = useCallback(
    ({ initialCanvas, initialContainer }: useEditorProps) => {
      initialCanvas.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new Rect({
        width: 600,
        height: 600,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new Shadow({ color: "rgba(0,0,0,0.8)", blur: 5 }),
      });
      // initialCanvas.setWidth(initialContainer?.offsetWidth ?? 0);
      // initialCanvas.setHeight(initialContainer?.offsetHeight ?? 0);
      initialCanvas.setDimensions({
        height: initialContainer?.offsetHeight,
        width: initialContainer?.offsetWidth,
      });
      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );
  return { init };
};
