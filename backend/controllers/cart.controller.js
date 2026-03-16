import { 
    addCartService, 
    deleteCartService, 
    updateCartService,
    fetchUserCartService,
} from "../services/cart.service.js"

// =========== PRODUCT ITEM ADD TO CART =======================
export const addToCart = async (request) => {
    const { title, quantity, price, product } = request.params
    let user = request.user
    
    if (!title || !price || !quantity || !product || !user) {
        throw new Error("All fields are required")
    }
    return await addCartService(title, quantity, price, product, user)
}

// ================= UPDATE CART ITEM QUANTITY ================
export const updateCartItem =async(request)=>{
    const {product, quantity} = request.params
    const user = request.user;
    return await updateCartService(user, product, quantity) 
}

// ============= DELETE CART ITEM =============================
export const deleteCartItem = async(request)=>{
    const {cartId} = request.params
    const user = request.user;
    return await deleteCartService(user, cartId,) 
}

// ============== FETCH USER CARTS ============================
export const fetchUserCarts =async(request)=>{
    const user = request.user;
    const carts = await fetchUserCartService(user)
    return carts
}