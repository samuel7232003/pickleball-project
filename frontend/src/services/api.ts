import axios, { AxiosInstance } from "axios";

export const apiInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:3001",
  withCredentials: true, 
});

apiInstance.interceptors.response.use(
  (response) => {
    return response?.data || response;
  },
  (error) => {
    if (error?.response?.data) return error.response.data;
    return Promise.reject(error);
  }
);
