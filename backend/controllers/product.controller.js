import { 
    addProductService, 
    fetchAllProductServices,
    deleteProductService,
    updateProductService,
    fetchLoginUserProducService
} from "../services/product.service.js"

// ============== ADD PRODUCT ==========================
export const addProduct = async (request) => {
    const { title, price, quantity, image, categories } = request.params
    const user = request.user
    if (!title || !price || !quantity || !image ||!categories || !user) {
        throw new Error("All fields are required")
    }
    return await addProductService(title, price, quantity, image, categories, user,)
}

// ================= FETCH ALL PRODUCTS ===================
export const fetchAllProduct = async(request)=>{
    // console.log("fetchAllProductServices")
    const products = await fetchAllProductServices()
    return products
}

// =============== DELETE PRODUCT =========================
export const deleteProduct = async(request)=>{
    const user= request.user;
    const {objectId} = request.params
    return await deleteProductService(user, objectId)
}

// =============== UPDATE PRODUCT =========================
export const updateProduct = async(request)=>{
    const user = request.user;
    const {title, price, quantity, image, productId} = request.params
    return await updateProductService(title, price, quantity, image, user, productId)
}

// ============== FETCH LOGIN USER PRODUCTS ================
export const fetchLoginUserProduct = async(request)=>{
    const user = request.user;
    const products = fetchLoginUserProducService(user)
    return products
}