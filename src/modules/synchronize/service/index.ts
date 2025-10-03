import adminApi from "../../../api/admin";
import { ParamsType } from "@types";

// ============= GET PYT HISTORY ============
export async function getSyncSchedule(params:ParamsType) {
    return (await adminApi.get(`api/v1/admin/hemis/schedule/sync`,{params})).data
}
// ============= GET PYT HISTORY ============
export async function getSyncEmployee() {
    return (await adminApi.get(`api/v1/admin/hemis/employee/sync`)).data
}
// ============= GET PYT HISTORY ============
export async function getSyncDepartment() {
    return (await adminApi.get(`api/v1/admin/hemis/department/sync`)).data
}