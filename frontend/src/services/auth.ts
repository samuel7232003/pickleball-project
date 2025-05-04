import { apiInstance } from "./api";

export const checkLogin = async () => {
  try {
    const response = await apiInstance.get('/profile', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi kiểm tra đăng nhập:", error);
    throw error;
  }
};
