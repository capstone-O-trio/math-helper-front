export type probInfoType = {
  mathId: number;
  image: string;
  mathTypeDto: {
    problem: string;
    type_name: string;
    script: string;
    answer: string;
    extractedImage: string;
  };
};

export type templateInfoType = {
  templateId: number;
  templateName: string; //사과로 더해보기
  templateScript: string; //이것은 이런 템플릿이야!
  isPossible: boolean;
  templateImage: string; //미리보기 이미지
};
