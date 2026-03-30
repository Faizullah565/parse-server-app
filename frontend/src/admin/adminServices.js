
import axios from "axios";
// import {useAuth} from '../context/AuthContext'
const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
// const {sessionToken} = useAuth()

const sessionToken = localStorage.getItem("sessionToken")

export const adminFetchAllUsers = async () => {
    try {
        const {data} = await axios.post(
            `${PARSE_SERVER_URL}/functions/adminFetchAllUsers`,
            {},
            {
                headers: {
                    "X-Parse-Application-Id": APP_ID,
                    "X-Parse-Session-Token": sessionToken,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("🚀 ~ adminFetchAllUsers ~ data:", data)

        return data;
    } catch (error) {
        throw error.response?.data?.error || "Users fetched failed";
    }
};

export const adminFetchAllOrders = async () => {
    try {
        const {data} = await axios.post(
            `${PARSE_SERVER_URL}/functions/adminFetchAllOrders`,
            {},
            {
                headers: {
                    "X-Parse-Application-Id": APP_ID,
                    "X-Parse-Session-Token": sessionToken,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("🚀 ~ adminFetchAllUsers ~ data:", data)

        return data;
    } catch (error) {
        throw error.response?.data?.error || "Users fetched failed";
    }
};

