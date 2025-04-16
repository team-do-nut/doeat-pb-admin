import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 15_000,
});

let accessToken: string | null = null;

apiClient.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err),
);

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const getAccessToken = () => accessToken;

export default apiClient;
