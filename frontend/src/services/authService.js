// import Parse from "../parse/config";

import axios from "axios";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;

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
    console.log("🚀 ~ signupUser ~ response:", response)

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Signup failed";
  }
};


export const loginUser = async (email, password) => {
  console.log("🚀 ~ loginUser ~ password:", password)
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
    console.log("🚀 ~ loginUser ~ data:", data)

    return data?.result;
  } catch (error) {
    throw error.response?.data?.error || "Login failed";
  }
};