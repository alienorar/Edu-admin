import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getLessonStatistics } from "../service"
import { openNotification } from "@utils"

// ============ CREATE ROLES ===========
export function useCreateStatistics() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:any) =>getLessonStatistics(data),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
            queryClient.invalidateQueries({ queryKey: ["lesson"] })
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}
