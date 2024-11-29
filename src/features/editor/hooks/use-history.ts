import { Canvas } from "fabric";
import { useCallback, useRef, useState } from "react";
import { JSON_KEYS } from "../types";

interface UseHistoryProps {
  canvas: Canvas | null;
  saveCallback?: (values: {
    json: string;
    width: number;
    height: number;
  }) => void;
}

export const useHistory = ({ canvas, saveCallback }: UseHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasHistory = useRef<string[]>([]);
  const skipSave = useRef(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const save = useCallback(
    (skip: boolean = false) => {
      // Determine if we should skip; default to false if not a boolean
      // Why not a boolean? in canvas.on, save method may accept an FabricObject as a parameter, should ignore it
      // src/features/editor/hooks/use-canvas-events.ts
      // canvas.on("object:added", save);
      if (typeof skip !== "boolean") {
        skip = false;
      }
      if (!canvas) return;
      const currentState = canvas!.toObject(JSON_KEYS);
      const json = JSON.stringify(currentState);
      if (!skip && !skipSave.current) {
        canvasHistory.current.push(json);
        setHistoryIndex(canvasHistory.current.length - 1);
      }
      const workspace = canvas
        .getObjects()
        .find((object) => "name" in object && object.name === "clip");
      saveCallback?.({
        json,
        width: workspace?.width ?? 0,
        height: workspace?.height ?? 0,
      });
    },
    [canvas, saveCallback]
  );

  const undo = useCallback(async () => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear();
      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(canvasHistory.current[previousIndex]);
      await canvas?.loadFromJSON(previousState);
      canvas?.renderAll();
      setHistoryIndex(previousIndex);
      skipSave.current = false;
    }
  }, [canUndo, canvas, historyIndex]);

  const redo = useCallback(async () => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear();
      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(canvasHistory.current[nextIndex]);

      await canvas?.loadFromJSON(nextState);
      canvas?.renderAll();
      setHistoryIndex(nextIndex);
      skipSave.current = false;
    }
  }, [canRedo, canvas, historyIndex]);

  return { save, canRedo, canUndo, redo, undo, setHistoryIndex, canvasHistory };
};
