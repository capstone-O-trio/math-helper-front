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
