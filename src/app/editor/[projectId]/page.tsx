"use client";

import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/components/editor";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { Loader, TriangleAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type EditorProjectIdPageProps = {
  projectId: string;
};

const EditorProjectIdPage = () => {
  const router = useRouter();

  const params = useParams<EditorProjectIdPageProps>();
  const { data, isLoading, isError } = useGetProject(params.projectId);
  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <TriangleAlert className="size-8 bg-destructive-foreground" />
        <p className="text-muted-foreground text-sm">Failed to fetch project</p>
        <Button variant="secondary" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    );
  }
  if (isLoading || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Editor initialData={data["data"]} />;
};

export default EditorProjectIdPage;
