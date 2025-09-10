import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getLessonStatistics} from "../service";

export function useGetLessonStatistics(params: ParamsType) {
    return useQuery({
        queryKey: ["lesson-statistics", params],
        queryFn: () => getLessonStatistics(params)
    })
}
