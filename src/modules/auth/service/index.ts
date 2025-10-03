import adminApi from "../../../api/admin";
import { SignIn } from "../types";


// ==============Sign In ============
export async function signIn(data:SignIn) {
    return await adminApi.post("/api/v1/admin/sign/in",data)
}



