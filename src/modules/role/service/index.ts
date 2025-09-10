// import axiosInstance from "@api";
import  axiosInstance  from "@api";
import { ParamsType, RolesResponse, RoleType } from "@types";

//============= GET ROLES ===============
export async function getRoles(params: ParamsType): Promise<RolesResponse> {
    return (await axiosInstance.get(`api/v1/admin/role/list`, { params })).data;
}

//============= GET ROLES ===============
export async function getRoleById(id:number|string) {
   return (await axiosInstance.get(`api/v1/admin/role/one?id=${id}`)).data
}


// ============ CREATE ROLE ===========
export async function createRoles(data: RoleType) {
    return await axiosInstance.post("api/admin/v1/role/create", data)
}

// ============ GET PERMESSIONS =========
export async function getPermessions() {
    return (await axiosInstance.get("api/admin/v1/role/permission/list")).data?.data
}

//============= UPDATE ROLES ===============
export async function updateRoles(data: RoleType) {
    const response = await axiosInstance.put(`api/admin/v1/role/update`, data);
    return response?.data
}

//=========== GET PERMESSION TREE ============
export async function GetPermessionTree () {
    const response = await axiosInstance.get(`api/v1/admin/role/permission/list/tree`);
    return response?.data?.data
}
