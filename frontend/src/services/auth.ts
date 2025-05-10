import { apiInstance } from "./api";

export const checkLogin = async () => {
  try {
    const response = await apiInstance.get('/profile');
    return response;
  } catch (error) {}
};
