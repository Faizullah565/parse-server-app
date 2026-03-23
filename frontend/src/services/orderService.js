import axios from "axios";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const sessionToken = localStorage.getItem("sessionToken");

export const createConfirmOrder = async (address, deliveryOption) => {
    try {
        const response = await axios.post(
            `${PARSE_SERVER_URL}/functions/placeOrder`,
            {
                shippingAddress: address,
                paymentMethod: deliveryOption
            },
            {
                headers: {
                    "X-Parse-Application-Id": APP_ID,
                    "X-Parse-Session-Token": sessionToken,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("🚀 ~ createConfirmOrder ~ response:", response)

        return response?.data;
    } catch (error) {
        throw error.response?.data?.error || "Place order failed";
    }
};

export const getUserOrders = async () => {
    try {
        const response = await axios.post(
            `${PARSE_SERVER_URL}/functions/getOrders`,
            {},
            {
                headers: {
                    "X-Parse-Application-Id": APP_ID,
                    "X-Parse-Session-Token": sessionToken,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("🚀 ~ getUserOrders ~ response:", response)

        return response?.data;
    } catch (error) {
        throw error.response?.data?.error || "Place order failed";
    }
};