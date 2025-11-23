import { ACCESS_TOKEN_KEY } from "../../utils/keys";
import { instance } from "../instance";
import { NewMathInfoResponse } from "../type";

//유형분류 api
export const postImgGetType = async (formData: FormData) => {
  const response = await instance.post("/maths/types", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

//새로운 문제 있는지 확인 api
export const getNewMaths = async () => {
  const response = await instance.get<NewMathInfoResponse>("/maths/new", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
    },
  });
  return response.data;
};

//정답확인 api
export const getAnswer = async (mathId: number, answer: number) => {
  const response = await instance.get(
    `/maths/answers/${mathId}?answer=${answer}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
      },
    }
  );
  return response.data;
};

//정오답 보기 api
export const getMathResult = async (mathId: number) => {
  const response = await instance.get(`/maths/randoms/${mathId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
    },
  });
  return response.data;
}