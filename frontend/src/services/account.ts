import { User } from "../redux/user/user.state"
import { apiInstance } from "./api"

export const signup = async (user:User) => {
  try {
    const response = await apiInstance.post('/signup', user);
    return response;
  } catch (error) {
    console.log(error)
  }
}

export const login = async (username: string, password: string) =>{
  try {
    const response = await apiInstance.post("/login", {username, password});
    return response;
  } catch (error) {
    console.log(error)
  }
}

export const logout = async () => {
  try {
    await apiInstance.post("/logout");
  } catch (error) {
    console.log(error);
  }
}