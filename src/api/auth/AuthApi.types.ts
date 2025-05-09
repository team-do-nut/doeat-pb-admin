export interface PostAuthLoginRequest {
  id: string;
  pw: string;
}

export interface PostAuthLoginResponse {
  token: string;
  storeId: number;
}

export interface PostAuthError {
  errorMessage: string;
}
