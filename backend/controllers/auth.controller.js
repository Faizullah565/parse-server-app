import { loginService, 
    registerService, 
    updateProfileService, 
    getUserProfileService,
    changePasswordService
} from "../services/auth.service.js";

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

export const updateProfile = async (request) => {
    const {name, email, phone, image } = request.params;
    const sessionToken = request.user;
    if (!name || !email || !phone || !image) {
        throw new Error("Username and password are required")
    }
    return await updateProfileService(name, email, phone, image, sessionToken)
}

export const getUserProfile = async (request) => {
    const {name, email, phone, image } = request.params;
    const user = request.user;
    if (!user) {
        throw new Error("User not found")
    }
    return await getUserProfileService(user)
}

export const changePassword = async (request) => {
    const {oldPassword, newPassword } = request.params;
    const user = request.user;
    if (!user) {
        throw new Error("User not found")
    }
    return await changePasswordService(oldPassword, newPassword, user)
}