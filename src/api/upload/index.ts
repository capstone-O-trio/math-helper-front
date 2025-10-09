import { ACCESS_TOKEN_KEY } from "../../utils/keys";
import { instance } from "../instance";

export const postUpload = async (formData: FormData) => {
  const response = await instance.post("/maths/images", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
