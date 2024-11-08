"use client";

import { Canvas, Rect, Shadow } from "fabric";
import { useCallback } from "react";

interface useEditorProps {
  initialCanvas: Canvas;
  initialContainer: HTMLDivElement | null;
}

export const useEditor = () => {
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
        width: 900,
        height: 1200,
        name: "flip",
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
    },
    []
  );
  return { init };
};
