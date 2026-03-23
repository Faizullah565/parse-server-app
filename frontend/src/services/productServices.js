import axios from "axios";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const sessionToken = localStorage.getItem("sessionToken");

export const fetchProducts = async () => {
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/fetchAllProduct`,
      {},
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
          // "X-Parse-Session-Token":"r:f768ed84e4aa2112ba991d61a41fa0de"
        },
      }
    );
    // console.log("🚀 ~ fetchProducts ~ response:", response.data)

    return response?.data;
  } catch (error) {
    throw error.response?.data?.error || "Product fetched failed";
  }
};


// IMAGE UPLOAD
export const uploadImage = async (file) => {

  try {

    const formData = new FormData();
    formData.append("file", file);
    // console.log("🚀 ~ uploadImage ~ file:", file)

    const { data } = await axios.post(
      `${PARSE_SERVER_URL}/files/${file.name}`,
      file,
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": file.type
        },
      }
    );
    console.log("🚀 ~ uploadImage ~ data:", data)

    return data?.url;

  } catch (error) {

    throw error.response?.data?.error || "Image upload failed";

  }
};


// ADD PRODUCT
export const addProduct = async (productData) => {
console.log("🚀 ~ addProduct ~ productData:", productData)

  try {

    const { data } = await axios.post(
      `${PARSE_SERVER_URL}/functions/addProduct`,
      productData,
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
          // "X-Parse-Master-Key":import.meta.env.VITE_PARSE_MASTER_KEY || "MASTER_KEY"
        },
      }
    );

    return data?.result;

  } catch (error) {
    throw error.response?.data?.error || "Product add failed";
  }
};


// FETCH LOGIN USE PRODUCTS ===============================
export const fetchLoginUserProducts = async () => {
  try {

    const res = await axios.post(
      `${PARSE_SERVER_URL}/functions/fetchLoginUserProduct`,
      {},
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Fetched login user product failed";
  }
};

// ========== DELETE LOGIN USER PRODUCTS ==========

// ADD PRODUCT
export const deleteLoginUserProduct = async (objectId) => {
  try {

    const res = await axios.post(
      `${PARSE_SERVER_URL}/functions/deleteProduct`,
      {objectId},
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error.response?.data?.error || "Fetched login user product failed";
  }
};