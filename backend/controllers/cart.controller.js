import { 
    addCartService, 
    deleteCartService, 
    updateCartService,
    fetchUserCartService,
    clearCartService
} from "../services/cart.service.js"

// =========== PRODUCT ITEM ADD TO CART =======================
export const addToCart = async (request) => {
    console.log("🚀 ~ addToCart ~ request:", request)
    const { title, price,objectId, image} = request.params
    // const objectId = request.params
    console.log("🚀 ~ addToCart ~ objectId:", objectId)
    let user = request.user
    
    if (!title || !price || !objectId || !user || !image) {
        throw new Error("All fields are required")
    }
    return await addCartService(title, price, image, objectId, user)
}

// ================= UPDATE CART ITEM QUANTITY ================
export const updateCartItem =async(request)=>{
    const {objectId, quantity} = request.params
    const user = request.user;
    return await updateCartService(user, objectId, quantity) 
}

// ============= DELETE CART ITEM =============================
export const deleteCartItem = async(request)=>{
    const {objectId} = request.params
    const user = request.user;
    return await deleteCartService(user, objectId,) 
}

// ============== FETCH USER CARTS ============================
export const fetchUserCarts =async(request)=>{
    const user = request.user;
    console.log("🚀 ~ fetchUserCarts ~ user:", user)
    const carts = await fetchUserCartService(user)
    return carts
}

// ============== FETCH USER CARTS ============================
export const clearCart =async(request)=>{
    const user = request.user;
    return await clearCartService(user)
}