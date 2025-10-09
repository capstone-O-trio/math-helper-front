import { instance } from "../instance";
import { UserInfo } from "../type/type";

export const postSignup = async (formData: UserInfo) => {
    const response = await instance.post<UserInfo>("/users/signup", formData);
    return response.data;
};