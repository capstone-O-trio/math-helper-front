/*
    problemTypes.ts
*/

// 문제의 정보를 담는 타입
export type mathProbInfoType = {
  mathId: number;
  probText: string; // 문제 텍스트
  probImage: string; // 문제 이미지 URL
  answer: number; // 정답
  probType: string; // 문제 유형
  probTemplate: string; // 문제 템플릿
  entityList: probEntityType[]; // 필요한 엔티티
};

// 문제에 필요한 엔티티 타입
export type probEntityType = {
  kind: string; // 엔티티 종류
  count: number; // 수량
  image: null | string; // 추출 이미지가 있다면
  weight?: null | number; // 무게 필드가 있다면
}

export type MathProbSolveType = {
  probImage: string; // 문제 이미지 URL
  answer: string;
  answerScript: string; // 정답 해설
  wrongList: string[]; // 오답 리스트
};