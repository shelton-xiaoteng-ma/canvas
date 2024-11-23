import { Canvas } from "fabric";
import { useCallback, useRef, useState } from "react";

interface UseHistoryProps {
  canvas: Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasHistory = useRef<string[]>([]);
  const skipSave = useRef(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex, canvas]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const save = useCallback(() => {
    if (!canvas) return;
    const currentState = canvas!.toObject(["name"]);
    const json = JSON.stringify(currentState);
    if (!skipSave.current) {
      canvasHistory.current.push(json);
      setHistoryIndex(canvasHistory.current.length - 1);
    }
    //TODO: Save callback
  }, [canvas, setHistoryIndex]);

  const undo = useCallback(async () => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear();
      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(canvasHistory.current[previousIndex]);
      await canvas?.loadFromJSON(previousState)!;
      canvas?.renderAll();
      setHistoryIndex(previousIndex);
      skipSave.current = false;
    }
  }, [canUndo, canvas, setHistoryIndex]);

  const redo = useCallback(async () => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear();
      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(canvasHistory.current[nextIndex]);

      canvas = await canvas?.loadFromJSON(nextState)!;
      canvas?.renderAll();
      setHistoryIndex(nextIndex);
      skipSave.current = false;
    }
  }, [canRedo, canvas, setHistoryIndex]);

  return { save, canRedo, canUndo, redo, undo, setHistoryIndex, canvasHistory };
};
