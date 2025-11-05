import { instance } from "../instance";
import { UserInfo } from "../type";

export const postSignup = async (formData: UserInfo) => {
  try {
    await instance.post<UserInfo>("/users/signup", formData);
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        throw new Error(data.message || "해당 아이디가 이미 존재합니다.");
      }
    }
    throw new Error("회원가입에 실패했습니다");
  }
};
