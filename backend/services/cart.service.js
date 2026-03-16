
// ================== ADD ITEM CART SERVICE ====================================
export const addCartService = async (title, quantity, price, product, user) => {
    console.log("🚀 ~ addCartService ~ user:", user)
    const Cart = Parse.Object.extend("Cart");
    const cart = new Cart();
    cart.set("title", title);
    cart.set("price", price);
    cart.set("quantity", quantity);
    cart.set("product", product)
    cart.set("user", user)
    //   product.set("user", user);
    await cart.save();
    return {
        success: true,
        message: "Item added to Cart",
        cart: {
            id: cart.id,
            title: cart.get("title"),
            price: cart.get("price"),
            quantity: cart.get("quantity")
        }
    };
}

// ============== UPDATE CART SERVICE ===============================
export const updateCartService = async (user, product, quantity) => {
    const Cart = Parse.Object.extend("Cart");
    const query = new Parse.Query(Cart);
    try {
        // Filter by user and product
        query.equalTo("user", user);
        query.equalTo("product", product);
        // Get single cart item
        const cart = await query.first({ useMasterKey: true });
        if (!cart) {
            throw new Error("Cart item not found");
        }
        cart.set("quantity", quantity);
        await cart.save(null, { useMasterKey: true });
        return cart;
    } catch (error) {
        console.log("🚀 updateCartService error:", error);
        throw error;
    }
};

// =================== DELETE CART SERVICE ===========================
export const deleteCartService = async (user, cartId) => {
    const Cart = Parse.Object.extend("Cart");
    const query = new Parse.Query(Cart);
    try {
        // Filter by user
        query.equalTo("user", user);
        // Filter by cart objectId
        query.equalTo("objectId", cartId);
        // Get the cart item
        const cartItem = await query.first({ useMasterKey: true });
        if (!cartItem) {
            throw new Error("Cart item not found");
        }
        // Delete the cart item
        await cartItem.destroy({ useMasterKey: true });
        return {
            message: "Cart item deleted successfully!"
        };
    } catch (error) {
        console.log("🚀 deleteCartService error:", error);
        throw error;
    }
};


// ================== FETCH USER CART SERVICE =================
export const fetchUserCartService = async (user) => {
    const Cart = Parse.Object.extend("Cart");
    const query = new Parse.Query(Cart)

    try {
        // match the user from cart items us
        query.equalTo("user", user)

        const cart = await query.find({ useMasterKey: true })
        console.log("🚀 ~ fetchUserCartService ~ cart:", cart)
        if (!cart?.length) {
            throw new Error("Cart item is empty");
        }
        return cart
    } catch (error) {
        return error
    }
}