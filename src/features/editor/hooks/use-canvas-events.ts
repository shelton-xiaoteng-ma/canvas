import { Canvas, FabricObject } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: Canvas | null;
  setSelectedObjects: (object: FabricObject[]) => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
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
    };
    if (canvas) {
      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", handleSelectionCleared);
    }

    return () => {
      if (canvas) {
        canvas.off("selection:cleared", handleSelectionCleared);
        canvas.off("selection:created", handleSelectionCreated);
        canvas.off("selection:updated", handleSelectionUpdated);
      }
    };
  }, [canvas, setSelectedObjects]);
};
