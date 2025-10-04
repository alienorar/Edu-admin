import { ParamsType } from "@types";
import adminApi from "../../../api/admin";


export interface ConfigureFacePayload {
  employeeId?: number |string|undefined;
  documentId?: number|string|undefined;
}
// ============= GET EMPLOYEE LIST ============
export async function getEmployeeList(params:ParamsType) {
    return (await adminApi.get(`api/v1/admin/employee/list`,{params})).data
}

// ============ CREATE ROLE ===========
export async function configureFace(data:ConfigureFacePayload) {
    return await adminApi.post("api/v1/admin/employee/face/configure", data)
}

// ============ CREATE ROLE ===========
export async function getStaffPosition() {
    return await adminApi.get("api/v1/admin/employee/staff/positions")
}


// ============ UPLOAD FILE ===========
export async function uploadFile(file: Blob): Promise<{
    data: any;
    documentId: any; id: number 
}> {
  const formData = new FormData();
  formData.append("file", file, "user_photo.jpg");

  const response = await adminApi.post("api/v1/admin/file/upload", formData);

  if (!response.data.data || !response.data.data.id) {
    throw new Error("Serverdan fayl IDsi topilmadi");
  }

  return { 
    data: response.data.data, 
    documentId: response.data.data.documentId, 
    id: response.data.data.id 
  };
}
