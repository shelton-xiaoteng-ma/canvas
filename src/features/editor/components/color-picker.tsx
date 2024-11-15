"use client";

import dynamic from "next/dynamic";

// Dynamically import ChromePicker with SSR disabled
const ChromePicker = dynamic(
  () => import("react-color/lib/components/chrome/Chrome"),
  { ssr: false }
);
const CirclePicker = dynamic(
  () => import("react-color/lib/components/circle/Circle"),
  { ssr: false }
);

// import { ChromePicker } from "react-color";
// import { CirclePicker } from "react-color";
import { colors } from "../types";
import { rgbaObjectToString } from "../utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        onChange={(color) => {
          const formatedValue = rgbaObjectToString(color.rgb);
          onChange(formatedValue);
        }}
        className="border rounded-lg"
      />
      <CirclePicker
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          const formatedValue = rgbaObjectToString(color.rgb);
          onChange(formatedValue);
        }}
      />
    </div>
  );
};
