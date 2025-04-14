declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_FRONT_URL: string;
    NEXT_PUBLIC_SERVER_URL: string;
    NEXT_PUBLIC_JWT_SECRET_KEY: string;
    NEXT_PUBLIC_TMP_LOGIN_ID: string;
    NEXT_PUBLIC_TMP_LOGIN_PW: string;
  }
}
