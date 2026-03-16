import { 
    addToCart, 
    updateCartItem,
    deleteCartItem,
    fetchUserCarts
 } from "../controllers/cart.controller.js";

Parse.Cloud.define("addToCart", addToCart)
// Parse.Cloud.define("addToCart", addToCart)
Parse.Cloud.define("updateCartItem", updateCartItem)
Parse.Cloud.define("deleteCartItem", deleteCartItem)
Parse.Cloud.define("fetchUserCarts", fetchUserCarts)