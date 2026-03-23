
// ================== ADD ITEM CART SERVICE ====================================
export const addCartService = async (title, price, image, objectId, user) => {
  const Cart = Parse.Object.extend("Cart");

  // ✅ Create product pointer
  const productPointer = new Parse.Object("_Product");
  productPointer.id = objectId;

  // ✅ Step 1: Check existing cart item
  const query = new Parse.Query(Cart);
  query.equalTo("user", user);
  query.equalTo("product", productPointer);

  const existingItem = await query.first();

  if (existingItem) {
    // ✅ Step 2: Increase quantity
    existingItem.increment("quantity", 1);
    await existingItem.save();

    return {
      success: true,
      message: "Quantity updated",
      cart: {
        id: existingItem.id,
        quantity: existingItem.get("quantity"),
      },
    };
  }

  // ✅ Step 3: Create new cart item
  const cart = new Cart();
  cart.set("title", title);
  cart.set("price", price);
  cart.set("quantity", 1);
  cart.set("product", productPointer);
  cart.set("image", image);
  cart.set("user", user);

  await cart.save();

  return {
    success: true,
    message: "Item added to Cart",
    cart: {
      id: cart.id,
      title: cart.get("title"),
      price: cart.get("price"),
      quantity: cart.get("quantity"),
    },
  };
};

// ============== UPDATE CART SERVICE ===============================
export const updateCartService = async (user, objectId, quantity) => {
    const Cart = Parse.Object.extend("Cart");
    const query = new Parse.Query(Cart);
    try {
        // Filter by user and Item Id
        query.equalTo("user", user);
        query.equalTo("objectId", objectId);

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
export const deleteCartService = async (user, objectId) => {
    const Cart = Parse.Object.extend("Cart");
    const query = new Parse.Query(Cart);
    try {
        // Filter by user
        query.equalTo("user", user);
        // Filter by cart objectId
        query.equalTo("objectId", objectId);
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

// ==== CLEAR CART ============================
export const clearCartService = async (user) => {
  const Cart = Parse.Object.extend("Cart");
  const query = new Parse.Query(Cart);

  try {
    // Filter by user
    query.equalTo("user", user);

    // Get ALL items
    const cartItems = await query.find({ useMasterKey: true });

    if (!cartItems.length) {
      return { message: "Cart already empty" };
    }

    // Delete ALL items
    await Parse.Object.destroyAll(cartItems, { useMasterKey: true });

    return {
      success: true,
      message: "Cart cleared successfully!",
    };

  } catch (error) {
    console.log("🚀 clearCartService error:", error);
    throw error;
  }
};