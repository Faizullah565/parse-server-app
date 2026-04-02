import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import api from "../../utils/baseUrlApi";
import { toast } from "react-toastify";
import axios from "axios";
import { getUserCart, removeUserCart, saveUserCart } from "../../utils/storedData";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const sessionToken = localStorage.getItem("sessionToken");

// ======== CREATE A CART CONTEXT ===========
const CartContext = createContext();

// ============== CART PROVIDER =====================
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getUserCart("save-cart") || []);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth-token")

  console.log("🚀 ~ CartProvider ~ cart:", cart)
  


  // ========== ITEM ADD-TO-CART FROM PRODUCTS PAGE =====================
  const addToCart = async (product) => {
    try {
      setLoading(true)
      // FIRST: call API
      const { data } = await axios.post(
        `${PARSE_SERVER_URL}/functions/addToCart`,
        product,
        {
          headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-Session-Token": sessionToken,
            "Content-Type": "application/json",
          },
        }
      );
      // THEN: update state
      setCart((prev = []) => {
        const exists = prev.find(
          (item) => item.objectId === product.objectId
        );

        if (exists) {
          return prev.map((item) =>
            item.objectId === product.objectId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { ...product, quantity: 1 }];
      });

    } catch (error) {
      toast.error("Add to cart failed")
      console.error("Add to cart failed:", error);
    }
    saveUserCart("save-cart", cart)
    setLoading(false)
  };

  const updateCartItemQuantityState = (cartItemId, newQuantity) => {
    // Update local state
    setCart((prevItems = []) =>
      prevItems.map(item =>
        item.objectId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    saveUserCart("save-cart", cart)
  }

  // ========== ITEM ADD-TO-CART FROM DETAILS PAGE =====================
  const detailsToCart = async (product) => {
    setCart((prev) => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + +product.quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity: +product.quantity, }];
    });
    saveUserCart("save-cart", cart)
  };

  // ========= INCREASE CART QUANTITY ====================
  const increaseQuantity = (id) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };
  // ========= DECREASE CART QUANTITY ====================
  const decreaseQuantity = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0) // quantity greater than 1
    );
  };
  // ========= ITEM REMOVE FROM CART ====================
  const removeFromCart = (objectId) => {
    setCart(prev => prev.filter(item => item.objectId !== objectId));
    console.log(cart)
    // saveUserCart("save-cart", cart)

  };

  // ========= CLEAR CART ====================
  const clearCartState = () => {
    setCart([])
    removeUserCart("save-cart")
    // saveUserCart("save-cart", cart)
  };
  
  const itemsPrice = cart?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCartState,
        itemsPrice,
        detailsToCart,
        loading,
        updateCartItemQuantityState,

      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);