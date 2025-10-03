import { ParamsType } from "@types";
import { getTutorStatistics } from "../service";
import { useQuery } from "@tanstack/react-query";

export function useGetTutorStatistics(params:ParamsType) {
    return useQuery({
        queryKey:["tutorStatistics",params],
        queryFn:()=> getTutorStatistics(params)
    })
}