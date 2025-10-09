import { instance } from "../instance";
import { LoginResponse, UserInfo } from "../type";

export const postLogin = async (formData: UserInfo) => {
  const response = await instance.post<LoginResponse>("/users/login", formData);
  return response.data.result;
};
