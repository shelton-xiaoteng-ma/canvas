import { Canvas, FabricObject } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: Canvas | null;
  setSelectedObjects: (object: FabricObject[]) => void;
  clearSelectionCallback?: () => void;
  save: () => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
  save,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    const handleSelectionCreated = (e) => {
      setSelectedObjects(e.selected);
    };
    const handleSelectionUpdated = (e) => {
      setSelectedObjects(e.selected);
    };
    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      clearSelectionCallback?.();
    };
    if (canvas) {
      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", handleSelectionCleared);
      canvas.on("object:added", save);
      canvas.on("object:removed", save);
      canvas.on("object:modified", save);
    }

    return () => {
      if (canvas) {
        canvas.off("object:added", save);
        canvas.off("object:removed", save);
        canvas.off("object:modified", save);
        canvas.off("selection:cleared", handleSelectionCleared);
        canvas.off("selection:created", handleSelectionCreated);
        canvas.off("selection:updated", handleSelectionUpdated);
      }
    };
  }, [save, canvas, setSelectedObjects, clearSelectionCallback]);
};
