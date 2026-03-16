import { loginService, registerService } from "../services/auth.service.js";

// ================== CREATE USER ==============================
export const createUser = async (request) => {
    const { username, email, password, aclRole} = request.params;
    if (!username || !email || !password ||!aclRole) {
        throw new Error("Username and password are required")
    }
    return await registerService(username, email, password, aclRole)
}

// =================== LOGIN USER ==============================
export const loginUser = async (request) => {
    const { email, password } = request.params;
    if (!email || !password) {
        throw new Error("Username and password are required")
    }
    return await loginService(email, password)
}