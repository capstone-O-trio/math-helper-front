export interface UserInfo {
  name: string;
  password: string;
}

//-------------------- Response type -------------------//
export interface LoginResponse {
  result: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface NewMathInfoResponse {
  result: {
    mathId: number;
    image: string; //사진url
    mathProblemDto: {
      problem: string; //3+4
      entity: string; //apple
      count1: number; //3
      count2: number; //4
      answer: number; //7
      wrongAnswers: number[]; //[5,9,8]
    };
  };
}
