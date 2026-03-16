import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:1337/parse",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;