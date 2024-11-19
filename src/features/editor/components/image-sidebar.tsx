import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetImages } from "@/features/images/api/use-get-images";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Loader, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

interface ImageSidebarProps {
  editor: Editor;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const { data, isLoading, isError } = useGetImages();
  return (
    <div
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Images"
        description="Add images to your canvas"
      />
      <div className="p-4 border-b">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].url);
          }}
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{ button: "Upload Image" }}
        />
      </div>
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-8 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <TriangleAlert className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to fetch images
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data?.data?.data?.response &&
              data?.data?.data?.response.map((image) => {
                return (
                  <button
                    onClick={() => {
                      editor?.addImage(image.urls.regular);
                    }}
                    key={image.id}
                    className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <Image
                      src={image.urls.small}
                      alt={image.alt_description || "Image"}
                      fill
                      className="object-cover"
                    />
                    <Link
                      href={image.links.html}
                      className="
                      opacity-0 group-hover:opacity-100 
                      text-[10px] truncate text-white
                      hover:underline p-1 bg-black/50
                      absolute left-0 bottom-0 
                      w-full text-left
                    "
                    >
                      {image.user.name}
                    </Link>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={() => onChangeActiveTool("images")} />
    </div>
  );
};
