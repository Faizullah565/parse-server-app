import axios from "axios";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const sessionToken = localStorage.getItem("sessionToken");

export const fetchUserCarts = async () => {
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/fetchUserCarts`,
      {},
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("🚀 ~ fetchUserCarts ~ response:", response)

    return response?.data;
  } catch (error) {
    throw error.response?.data?.error || "Product fetched failed";
  }
};


// Update Cart Item Quantity
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/updateCartItem`,
      {
        objectId:itemId,
        quantity
      },
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("🚀 ~ updateCartItemQuantity ~ response:", response)
    return response?.data;
  } catch (error) {
    throw error.response?.data?.error || "Product fetched failed";
  }
};

// DELETE Cart Item
export const deleteCartItem = async (cartItemId) => {
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/deleteCartItem`,
      {
        objectId:cartItemId,
      },
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("🚀 ~ deleteCartItem ~ response:", response)
    return response?.data;
  } catch (error) {
    throw error.response?.data?.error || "Delete cart item failed";
  }
};

// CLEAR CART
export const clearCart = async () => {
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/clearCart`,
      {},
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error.response?.data?.error || "Clear cart failed";
  }
};