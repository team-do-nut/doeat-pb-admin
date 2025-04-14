import axios, { AxiosInstance } from 'axios';
import { PostAuthLoginRequest, PostAuthLoginResponse } from './AuthApi.types';

class AuthApi {
  private static authClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FRONT_URL,
    timeout: 10_000,
  });

  static postAuthLogin = async ({ id, pw }: PostAuthLoginRequest) => {
    const res = await this.authClient.post<PostAuthLoginResponse>(
      '/api/auth/login',
      { id, pw },
      { withCredentials: true },
    );
    return res;
  };

  static postAuthLogout = () => {
    const res = this.authClient.post<null>('/api/auth/logout', null, { withCredentials: true });
    return res;
  };
}

export default AuthApi;
