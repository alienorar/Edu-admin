import { useQuery } from "@tanstack/react-query";
import { getPmtGroupList, getProperty } from "../service";
import { ParamsType } from "@types";

// ============ GET Group list ===========
export function useGetProperty(params:ParamsType) {
    return useQuery({
        queryKey: ["property",params],
        queryFn: () => getProperty(params)
    })
}


// ============= GET PAYMENT GROUP LIST ============
export function useGetPmtGroupList() {
    return useQuery({
        queryKey: ["payment-group"],
        queryFn: () => getPmtGroupList()
    })
}