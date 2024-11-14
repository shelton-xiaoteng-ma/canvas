"use client";

import {
  Canvas,
  Circle,
  FabricObject,
  Polygon,
  Rect,
  Shadow,
  Triangle,
} from "fabric";
import { useCallback, useMemo, useState } from "react";
import {
  buildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
} from "../types";
import { useAutoResize } from "./use-auto-resize";

interface useEditorProps {
  initialCanvas: Canvas;
  initialContainer: HTMLDivElement | null;
}

const buildEditor = ({ canvas }: buildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas
      .getObjects()
      .find((object) => "name" in object && object.name === "clip");
  };
  const center = (object: FabricObject) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();
    canvas._centerObject(object, center!);
  };

  const addToCanvas = (object: FabricObject) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    addCircle: () => {
      const object = new Circle({ ...CIRCLE_OPTIONS });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new Rect({ ...RECTANGLE_OPTIONS, rx: 50, ry: 50 });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new Rect({ ...RECTANGLE_OPTIONS });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new Triangle({ ...TRIANGLE_OPTIONS });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      // const object = new Triangle({ ...TRIANGLE_OPTIONS, angle: 180 });
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;
      const object = new Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...RECTANGLE_OPTIONS,
        }
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      // const object = new Rect({
      //   ...RECTANGLE_OPTIONS,
      //   angle: 45,
      //   rx: 50,
      //   ry: 50,
      // });
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;
      const object = new Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
        }
      );
      addToCanvas(object);
    },
  };
};

export const useEditor = () => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({
    canvas,
    container,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({ canvas });
    }
    return undefined;
  }, [canvas]);

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
  return { init, editor };
};
