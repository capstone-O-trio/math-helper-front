export type probInfoType = {
  mathId: number;
  image: string;
  mathTypeDto: {
    problem: string;
    type_name: string;
    answer: string;
    extractedImage: string;
  };
};

export type templateInfoType = {
  templateId: number;
  templateName: string; //사과로 더해보기
  isPossible: boolean;
  templateImage: string; //미리보기 이미지
};
