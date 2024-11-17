"use client";

import {
  Canvas,
  Circle,
  FabricObject,
  Polygon,
  Rect,
  Shadow,
  Textbox,
  Triangle,
} from "fabric";
import { useCallback, useMemo, useState } from "react";
import {
  buildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "../types";
import { isTextType } from "../utils";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";

interface useEditorProps {
  initialCanvas: Canvas;
  initialContainer: HTMLDivElement | null;
}

const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  strokeDashArray,
  setStrokeDashArray,
}: buildEditorProps): Editor => {
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
    getActiveOpacity: (): number => {
      const object = canvas.getActiveObjects()[0];
      if (object) {
        return object.get("opacity");
      }
      return 1;
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });

      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectForward(object, true);
      });

      canvas.renderAll();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectBackwards(object, true);
      });
      const workspace = getWorkspace();
      canvas.sendObjectToBack(workspace!);
      canvas.renderAll();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // Text types don't have stroke
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    addText: () => {
      const object = new Textbox("Hello", { ...TEXT_OPTIONS });
      // addToCanvas(object);
      canvas.add(object);
      // canvas.setActiveObject(object);
    },
    addCircle: () => {
      const object = new Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
        rx: 50,
        ry: 50,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
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
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
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
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    canvas,
    // fillColor,
    getActiveObjectFillColor: () => {
      const selectedObject = canvas.getActiveObjects()[0];
      if (!selectedObject) return fillColor;
      return selectedObject.get("fill");
    },
    // strokeColor,
    getActiveObjectStrokeColor: () => {
      const selectedObject = canvas.getActiveObjects()[0];
      if (!selectedObject) return strokeColor;
      return selectedObject.get("stroke");
    },
    // strokeWidth,
    getActiveObjectStrokeWidth: (): number => {
      const selectedObject = canvas.getActiveObjects()[0];
      if (!selectedObject) return strokeWidth;
      return selectedObject.get("strokeWidth");
    },
    getActiveObjectStrokeDashArray: (): number[] => {
      const selectedObject = canvas.getActiveObjects()[0];
      if (!selectedObject) return strokeDashArray;
      return selectedObject.get("strokeDashArray");
    },
  };
};

export const useEditor = ({
  clearSelectionCallback,
}: {
  clearSelectionCallback: () => void;
}) => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<FabricObject[]>([]);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        strokeDashArray,
        setStrokeDashArray,
      });
    }
    return undefined;
  }, [canvas, fillColor, strokeColor, strokeWidth, strokeDashArray]);

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
