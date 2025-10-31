import axios from "axios";

// const API_BASE_URL = "https://envocare.demovoting.com/api";
// export const IMAGE_PATH = "https://envocare.demovoting.com/uploads";

// export const API_BASE_URL = "http://localhost:8000/api";
export const API_BASE_URL = "http://127.0.0.1:8000/api";
// export const IMAGE_PATH = "http://localhost:8000/uploads";
export const IMAGE_PATH = "http://127.0.0.1:8000/uploads";

// console.log("API Base URL:", API_BASE_URL);
// console.log("Image Path:", IMAGE_PATH);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
