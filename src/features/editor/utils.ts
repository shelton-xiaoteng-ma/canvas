import { RGBColor } from "react-color";
import { v4 as uuid } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformText = (objects: any) => {
  if (!objects) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      return item.type === "text" && item.type === "textbox";
    }
  });
};

export const downloadFile = ({
  file,
  type,
}: {
  file: string;
  type: string;
}) => {
  const anchorElement = document.createElement("a");
  anchorElement.href = file;
  anchorElement.download = `${uuid()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
};

export const isTextType = (type: string | undefined) => {
  return type === "text" || type === "i-text" || type === "textbox";
};

export const rgbaObjectToString = (rgba: RGBColor | "transparent") => {
  if (rgba === "transparent") {
    return `rgba(0,0,0,0)`;
  }
  const alpha = rgba.a === undefined ? 1 : rgba.a;
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
};
