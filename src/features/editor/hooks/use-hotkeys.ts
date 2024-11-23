import { ActiveSelection, Canvas } from "fabric";
import { useEvent } from "react-use";

interface UseHotkeysProps {
  canvas: Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  paste: () => void;
  copy: () => void;
}

export const useHotkeys = ({
  canvas,
  undo,
  redo,
  save,
  paste,
  copy,
}: UseHotkeysProps) => {
  useEvent("keydown", (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const isBackspace = event.key === "Backspace";
    const isInput = ["INPUT", "TEXTAREA"].includes(
      (event.target as HTMLElement).tagName
    );
    if (isInput) return;
    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?._discardActiveObject();
    }

    if (isCtrlKey && event.key === "z") {
      event.preventDefault();
      undo();
    }
    if (isCtrlKey && event.key === "y") {
      event.preventDefault();
      redo();
    }
    if (isCtrlKey && event.key === "c") {
      event.preventDefault();
      copy();
    }
    if (isCtrlKey && event.key === "v") {
      event.preventDefault();
      paste();
    }
    if (isCtrlKey && event.key === "s") {
      event.preventDefault();
      save(true);
    }
    if (isCtrlKey && event.key === "a") {
      event.preventDefault();
      canvas?.discardActiveObject();

      const allObjects = canvas
        ?.getObjects()
        .filter((object) => object.selectable);
      canvas?.setActiveObject(new ActiveSelection(allObjects, { canvas }));
      canvas?.renderAll();
    }
  });
};
