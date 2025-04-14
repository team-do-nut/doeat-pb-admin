export interface PostAuthLoginRequest {
  id: string;
  pw: string;
}

export interface PostAuthLoginResponse {
  token: string;
}

export interface PostAuthError {
  errorMessage: string;
}
