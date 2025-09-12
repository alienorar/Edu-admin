import axiosInstance from "@api";
import { ParamsType } from "@types";

export  interface Property {
    key?: string;
  id: number|undefined;
  active: boolean;
  value: string;
}

// ============= GET GROUP LIST ============
export async function getProperty(params:ParamsType) {
    return (await axiosInstance.get(`/api/v1/admin/property`,{params})).data
}

// ============= UPDATE GROUP LIST ============
export async function updateProperty(data:Property) {
   const response =  await axiosInstance.patch(`/api/v1/admin/property`,data)
   return response?.data
    
}

// ============= GET PAYMENT GROUP LIST ============
export async function getPmtGroupList() {
    return (await axiosInstance.get("api/payment-group/list",)).data
}