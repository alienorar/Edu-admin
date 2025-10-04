import { useQuery } from "@tanstack/react-query";
import { getEmployeeList, getStaffPosition } from "../service";
import { ParamsType } from "@types";

// ============ GET Employee list ===========
export function useGetEmployeeList(params:ParamsType) {
    return useQuery({
        queryKey: ["employee",params],
        queryFn: () => getEmployeeList(params)
    })
}
export function useGetStaffPosition() {
    return useQuery({
        queryKey: ["staffPosition"],
        queryFn: () => getStaffPosition()
    })
}
