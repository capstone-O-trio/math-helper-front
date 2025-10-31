import { getAnswer } from "../api/upload";

//정답 확인 로직
export const useCheckAnswer = async (mathId: number, userAnswer: number) => {
  const response = await getAnswer(mathId, userAnswer);

  if (response) {
    return response.result;
  }

  alert("정답 확인 중 오류가 발생했습니다.");
  return false;
};
