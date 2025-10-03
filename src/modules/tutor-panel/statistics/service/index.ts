import { ParamsType } from "@types";
import teacherApi from "../../../../api/tutor";

// ============= GET TUTOR STATISTICS ============
export async function getTutorStatistics(params:ParamsType) {
    return (await teacherApi.get(`api/v1/tutor/statistics/lesson/load/filter`,{params})).data
}