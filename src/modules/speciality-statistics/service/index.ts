
import axiosInstance from "@api";
import { ParamsType } from "@types";

export async function getLessonStatistics(params: ParamsType) {
    return (await axiosInstance.get(`api/v1/admin/statistics/lesson/load`, { params })).data
}
export async function getDepartmentList() {
    return (await axiosInstance.get(`api/v1/admin/department/list`)).data
}
