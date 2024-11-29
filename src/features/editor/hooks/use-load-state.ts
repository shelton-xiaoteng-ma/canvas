import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { JSON_KEYS } from "../types";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: Canvas | null;
  initialState: React.MutableRefObject<string | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
  autoZoom,
  canvas,
  setHistoryIndex,
  canvasHistory,
  initialState,
}: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialState?.current && canvas) {
      canvas.loadFromJSON(JSON.parse(initialState.current));
      const currentState = JSON.stringify(canvas!.toObject(JSON_KEYS));
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
      autoZoom();
      initialized.current = true;
    }
  }, [autoZoom, canvas, canvasHistory, initialState, setHistoryIndex]);
};
