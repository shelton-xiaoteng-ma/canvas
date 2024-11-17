import { Canvas } from "fabric";
import * as material from "material-colors";

export const selectionDependentTools = [
  "fill",
  "font",
  "filter",
  "opacity",
  "remove-bg",
  "stroke-color",
  "stroke-width",
];

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.grey["500"],
  material.blueGrey["500"],
  "transparent",
];

export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates";

export type buildEditorProps = {
  canvas: Canvas;
  fillColor: string;
  setFillColor: (value: string) => void;
  strokeColor: string;
  setStrokeColor: (value: string) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  strokeDashArray: number[];
  setStrokeDashArray: (value: number[]) => void;
};

export interface Editor {
  addText: () => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeDashArray: (value: number[]) => void;
  changeOpacity: (value: number) => void;
  // fillColor: string;
  getActiveObjectFillColor: () => string;
  // strokeColor: string;
  getActiveObjectStrokeColor: () => string;
  // strokeWidth: number;
  getActiveObjectStrokeWidth: () => number;
  getActiveObjectStrokeDashArray: () => number[];
  getActiveOpacity: () => number;
  canvas: Canvas;
  bringForward: () => void;
  sendBackwards: () => void;
}

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;

export const CIRCLE_OPTIONS = {
  radius: 200,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTIONS = {
  width: 400,
  height: 400,
  angle: 0,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const TRIANGLE_OPTIONS = {
  width: 400,
  height: 400,
  angle: 0,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const DIAMOND_OPTIONS = {
  width: 600,
  height: 600,
  angle: 0,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const TEXT_OPTIONS = {
  left: 200,
  top: 200,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};
