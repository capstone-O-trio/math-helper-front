import { probInfoType, templateInfoType } from "type/type";

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
  isSuccess: boolean;
  code: string;
  message: string;
  result: probInfoType;
}

export type TemplateListResponse = {
  result: { templates: templateInfoType[] };
};
