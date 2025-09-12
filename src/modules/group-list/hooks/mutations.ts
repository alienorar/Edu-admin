import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Property, updateProperty, } from "../service";
import { openNotification } from "@utils";


// ============ UPDATE GROUP LIST ===========
export function useUpdateProperty () {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:Property) => updateProperty(data),
         onSuccess: (data) => {
                    openNotification("success", "Success", data?.message)
                },
                onSettled: (_, error) => {
                    if (error) {
                        openNotification("error", "Error", error?.message)
                    } else {
                        queryClient.invalidateQueries({ queryKey: ["property"] })
                    }
                }
    })
} 