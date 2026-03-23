import { 
    addToCart, 
    updateCartItem,
    deleteCartItem,
    fetchUserCarts,
    clearCart
 } from "../controllers/cart.controller.js";

Parse.Cloud.define("addToCart", addToCart)
// Parse.Cloud.define("addToCart", addToCart)
Parse.Cloud.define("updateCartItem", updateCartItem)
Parse.Cloud.define("deleteCartItem", deleteCartItem)
Parse.Cloud.define("fetchUserCarts", fetchUserCarts)
Parse.Cloud.define("clearCart", clearCart)