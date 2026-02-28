// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://lab5-20nt.onrender.com/api", // 🔥 Your Render backend
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // prevents hanging forever
});

export default api;