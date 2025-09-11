import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getDepartmentList, getLessonStatistics} from "../service";

export function useGetLessonStatistics(params: ParamsType) {
    return useQuery({
        queryKey: ["lesson-statistics", params],
        queryFn: () => getLessonStatistics(params)
    })
}

export function useGetDepartmentList() {
    return useQuery({
        queryKey: ["department",],
        queryFn: () => getDepartmentList()
    })
}
