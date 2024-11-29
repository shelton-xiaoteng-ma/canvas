import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":id"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":id"]["$patch"]
>["json"];

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["project", { id }],
    mutationFn: async (json) => {
      const response = await client.api.projects[":id"]["$patch"]({
        param: { id },
        json,
      });
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      return await response.json();
    },
    onSuccess: () => {
      // TODO: Invalidate projects query
      queryClient.invalidateQueries({ queryKey: ["project", { id }] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
  return mutation;
};
