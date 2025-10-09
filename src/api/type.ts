export interface UserInfo {
  name: string;
  password: string;
}

export interface LoginResponse {
  result: {
    accessToken: string;
    refreshToken: string;
  };
}
