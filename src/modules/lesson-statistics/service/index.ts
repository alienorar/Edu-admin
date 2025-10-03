
import adminApi from "../../../api/admin";
import { ParamsType } from "@types";

export async function getLessonStatistics(params: ParamsType) {
    return (await adminApi.get(`api/v1/admin/statistics/lesson/load`, { params })).data
}
export async function getDepartmentList() {
    return (await adminApi.get(`api/v1/admin/department/list`)).data
}
