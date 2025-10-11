import { ACCESS_TOKEN_KEY } from "../../utils/keys";
import { instance } from "../instance";
import { NewMathInfoResponse } from "../type";

//사진 업로드 api
export const postUpload = async (formData: FormData) => {
  const response = await instance.post("/maths/images", formData, {
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

//정오답 보기 받기 api
export const getChoice = async (mathId: number) => {
  const response = await instance.get(`/maths/images/${mathId}}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) || ""}`,
    },
  });
  return response.data;
};

//문제풀기 api - 문제정보 받아옴
//사진확인 api - 사진 url 받아옴
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
