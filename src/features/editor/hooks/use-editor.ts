"use client";

import {
  Canvas,
  Circle,
  FabricImage,
  FabricObject,
  PencilBrush,
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
  IMAGE_OPTIONS,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
} from "../types";
import { downloadFile, isTextType, transformText } from "../utils";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import { useClipboard } from "./use-clipboard";
import { useHistory } from "./use-history";
import { useHotkeys } from "./use-hotkeys";

interface useEditorProps {
  initialCanvas: Canvas;
  initialContainer: HTMLDivElement | null;
}

const buildEditor = ({
  canUndo,
  canRedo,
  redo,
  undo,
  save,
  autoZoom,
  copy,
  paste,
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
  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as Rect;
    const multiplier = 1;

    return {
      name: "Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
      multiplier,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL(options);
    downloadFile({ file: dataUrl, type: "png" });
    autoZoom();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL(options);
    downloadFile({ file: dataUrl, type: "svg" });
    autoZoom();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const dataUrl = canvas.toDataURL(options);
    downloadFile({ file: dataUrl, type: "jpg" });
    autoZoom();
  };

  const saveJson = async () => {
    const dataUrl = canvas.toObject(["name"]);

    await transformText(dataUrl.objects);

    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t")
    )}`;

    downloadFile({ file: fileString, type: "json" });
  };

  const loadJson = async (json: string) => {
    const data = JSON.parse(json);
    await canvas.loadFromJSON(data);
    autoZoom();
  };

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
    saveJpg,
    savePng,
    saveSvg,
    saveJson,
    loadJson,
    canUndo,
    canRedo,
    redo,
    undo,
    save,
    getWorkspace,
    autoZoom,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenterPoint();
      canvas.zoomToPoint(center, zoomRatio);
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenterPoint();
      canvas.zoomToPoint(center, zoomRatio < 0.2 ? 0.2 : zoomRatio);
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();
      workspace?.set(value);
      autoZoom();
      // changeSize changeBackground can't trigger useCanvasEvents
      save();
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      save();
    },
    enableDrawingMode: () => {
      canvas?.discardActiveObject();
      canvas.isDrawingMode = true;
      canvas?.renderAll();
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = strokeColor;
      canvas.freeDrawingBrush.width = strokeWidth;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
      const objects = canvas.getObjects();
      objects.forEach((object) => {
        if (object.type === "path" && object.fill === null) {
          object.fill = fillColor;
        }
      });
    },
    onCopy: () => copy(),
    onPaste: () => paste(),
    addImage: async (url: string) => {
      const object = await FabricImage.fromURL(
        url,
        {
          crossOrigin: "anonymous",
        },
        {
          ...IMAGE_OPTIONS,
        }
      );
      const workspace = getWorkspace();
      object.scaleToHeight(workspace?.height || 0);
      object.scaleToWidth(workspace?.width || 0);
      addToCanvas(object);
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    },
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
        if (object.type === "path") return;
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
      canvas.freeDrawingBrush!.color = value;
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = value;
      }
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
      addToCanvas(object);
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

  const { save, redo, undo, canUndo, canRedo, setHistoryIndex, canvasHistory } =
    useHistory({ canvas });

  const { copy, paste } = useClipboard({ canvas });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
    save,
  });

  useHotkeys({ undo, redo, copy, paste, save, canvas });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canUndo,
        canRedo,
        redo,
        undo,
        save,
        autoZoom,
        copy,
        paste,
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
  }, [
    canUndo,
    canRedo,
    redo,
    undo,
    save,
    autoZoom,
    copy,
    paste,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    strokeDashArray,
  ]);

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
        stroke: "#FFF",
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
      canvasHistory.current = [
        JSON.stringify(initialCanvas.toObject(["name"])),
      ];
      setHistoryIndex(0);
    },
    [setHistoryIndex, canvasHistory]
  );
  return { init, editor };
};
