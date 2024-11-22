import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Minimize, ZoomIn, ZoomOut } from "lucide-react";
import { Editor } from "../types";

interface FooterProps {
  editor: Editor | undefined;
}

export const Footer = ({ editor }: FooterProps) => {
  return (
    <footer className="h-[52px] border-t bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse">
      <Hint label="Reset" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          onClick={() => {
            editor?.autoZoom();
          }}
          className="h-full"
        >
          <Minimize />
        </Button>
      </Hint>
      <Hint label="Zoom In" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          onClick={() => {
            editor?.zoomIn();
          }}
          className="h-full"
        >
          <ZoomIn />
        </Button>
      </Hint>
      <Hint label="Zoom Out" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          onClick={() => {
            editor?.zoomOut();
          }}
          className="h-full"
        >
          <ZoomOut />
        </Button>
      </Hint>
    </footer>
  );
};
