import axios, { AxiosInstance } from "axios";

export const apiInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:3001",
});

// Add a request interceptor
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiInstance.interceptors.response.use(
  (response) => {
    return response?.data || response;
  },
  (error) => {
    if (error?.response?.data) return error.response.data;
    return Promise.reject(error);
  }
);
