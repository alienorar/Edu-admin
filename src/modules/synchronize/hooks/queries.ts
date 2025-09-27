import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getSyncDepartment, getSyncEmployee, getSyncSchedule } from "../service";

// ============ GET PAYMENT HISTORY ===========
export function useGetSyncSchedule(params: ParamsType, _p0: { enabled: boolean; }) {
    return useQuery({
        queryKey:["schedule",params],
        queryFn:()=> getSyncSchedule(params)
    })
}
// ============ GET PAYMENT HISTORY ===========
export function useGetSyncEmployee(_p0: { enabled: boolean; }) {
    return useQuery({
        queryKey:["employee"],
        queryFn:()=> getSyncEmployee()
    })
}
// ============ GET PAYMENT HISTORY ===========
export function useGetSyncDepartment(_p0: { enabled: boolean; }) {
    return useQuery({
        queryKey:["department"],
        queryFn:()=> getSyncDepartment()
    })
}