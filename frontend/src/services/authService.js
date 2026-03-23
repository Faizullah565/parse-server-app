
import axios from "axios";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const sessionToken = localStorage.getItem("sessionToken");


export const signupUser = async (email, password, role) => {
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/createUser`,
      {
        username: email,
        email: email,
        password: password,
        aclRole:role
      },
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Signup failed";
  }
};


export const loginUser = async (email, password) => {
  try {
    const {data} = await axios.post(
      `${PARSE_SERVER_URL}/functions/loginUser`,
      {
        email,
        password
        
      },
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "Content-Type": "application/json",
        },
      }
    );

    return data?.result;
  } catch (error) {
    throw error.response?.data?.error || "Login failed";
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/getUserProfile`,
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
    throw error.response?.data?.error || "Profile fetched failed";
  }
};


export const changePassword = async (passwordData) => {
  const sessionToken = localStorage.getItem("sessionToken");
  
  try {
    const response = await axios.post(
      `${PARSE_SERVER_URL}/functions/changePassword`,
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      },
      {
        headers: {
          "X-Parse-Application-Id": APP_ID,
          "X-Parse-Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("🚀 ~ changePassword ~ response:", response)
    if(!response.data?.result?.success){
      throw new Error(response.data?.result?.message)
    }
    return response?.data;
  } catch (error) {
    console.log("🚀 ~ changePassword ~ error:", error);
    throw error.response?.data?.error || "Password change failed";
  }
};