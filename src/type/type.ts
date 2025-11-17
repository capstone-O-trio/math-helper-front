export type probInfoType = {
  mathId: number;
  probType: string;
  entity: string;
  count1: number;
  count2: number;
  problem: string;
  answer: number;
  wrongAnswer: number[];
};

export type templateInfoType = {
  templateId: number;
  templateName: string; //사과로 더해보기
  isPossible: boolean;
  templateImage: string; //미리보기 이미지
};