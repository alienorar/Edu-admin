import adminApi from "../../../api/admin";
import { ParamsType } from "@types";

// ============= GET PYT HISTORY ============
export async function getXaznaHistory(params:ParamsType) {
    return (await adminApi.get(`api/v1/payment/history/xazna`,{params})).data
}