"use client";

import { Canvas, iMatrix, Point, TMat2D, util } from "fabric";
import { useCallback, useEffect } from "react";

interface useAutoResizeProps {
  canvas: Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: useAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setDimensions({ height: height, width: width });

    const center = canvas.getCenterPoint();

    const zoomRatio = 0.85;
    const localWorkspace = canvas
      .getObjects()
      .find((object) => "name" in object && object.name === "clip");
    const scale = util.findScaleToFit(
      {
        width: localWorkspace?.width ?? 100,
        height: localWorkspace?.height ?? 100,
      },
      {
        width: width,
        height: height,
      }
    );

    const zoom = zoomRatio * scale;

    canvas.setViewportTransform(iMatrix.concat() as TMat2D);

    canvas.zoomToPoint(new Point(center.x, center.y), zoom);

    if (!localWorkspace) return;

    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    ) {
      return;
    }

    viewportTransform[4] =
      canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
    viewportTransform[5] =
      canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    canvas.setViewportTransform(viewportTransform);
    // localWorkspace.clone((cloned: Rect) => {
    //   canvas.clipPath = cloned;
    //   canvas.requestRenderAll();
    // });
    canvas.requestRenderAll();
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });
      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};
