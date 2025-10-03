import { useMutation, useQueryClient } from "@tanstack/react-query"
import { configureFace, ConfigureFacePayload, uploadFile } from "../service"
import { openNotification } from "@utils"

// ============ CREATE ROLES ===========
export function useConfigureFace() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:ConfigureFacePayload) => configureFace(data),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
            queryClient.invalidateQueries({ queryKey: ["face-configure"] })
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
    onError: (error: Error) => {
      console.error("Rasm yuklashda xatolik:", error);
    
    },
  });
}