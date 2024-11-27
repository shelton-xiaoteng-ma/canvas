import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Banner = () => {
  return (
    <div
      className="
        aspect-[5/1] 
        min-h-[248px] 
        gap-x-6 p-6 
        flex items-center 
        rounded-xl 
        bg-gradient-to-r
        from-[#2e62cb] via-[#0073ff] to-[#3faff5]
        text-white
        "
    >
      <div className="rounded-full size-28 items-center justify-center bg-white/50 shrink-0 hidden md:flex">
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">
          Visualize your ideas with Canvas
        </h1>
        <p className="text-sm mb-2">
          Turn inspiration into design in no time. Simply upload an image and
          let AI do the rest.
        </p>
        <Button variant="secondary" className="w-[160px]">
          Start creating
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
