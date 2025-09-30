import axios from "axios";
import Constants from "expo-constants";

const BASE_URL =
  Constants.expoConfig?.extra?.BASE_URL ||
  Constants.manifest2?.extra?.BASE_URL ||
  "http://192.168.1.8:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
