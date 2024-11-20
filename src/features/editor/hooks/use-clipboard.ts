import { Canvas, FabricObject, Group } from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
  canvas: Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<Group | FabricObject | null>(null);

  const copy = useCallback(async () => {
    // const clonedObjects = await Promise.all(
    //   canvas?.getActiveObjects()?.map(async (object) => {
    //     console.log(object.left, object.top);
    //     return await object.clone();
    //   }) || []
    // );
    const selectedObjects = canvas?.getActiveObjects();
    if (selectedObjects?.length === 1) {
      clipboard.current = await selectedObjects[0].clone();
    } else {
      // Why new group? When objects are added to a group, their positions become relative to the group’s center (or the originX/originY specified).
      // Why {stroke: ""} ? new Group, property Stroke default null, throw error <Cannot read properties of null (reading 'hex')>
      const clonedObjects = await new Group(selectedObjects, {
        stroke: "",
      }).clone();
      clipboard.current = clonedObjects;
    }
  }, [canvas]);

  const paste = useCallback(async () => {
    if (!clipboard.current) return;
    canvas?.discardActiveObject();
    const copiedObjects = clipboard.current;
    // if (copiedObjects.type === "group") {
    // }
    copiedObjects.set({
      top: copiedObjects.top + 10,
      left: copiedObjects.left + 10,
    });
    canvas?.add(copiedObjects);
    canvas?.setActiveObject(copiedObjects);
    canvas?.requestRenderAll();
  }, [canvas]);

  return { copy, paste };
};
