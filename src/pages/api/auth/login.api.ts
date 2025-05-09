import { serialize } from 'cookie';
import { SignJWT } from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';
import { PostAuthError, PostAuthLoginRequest, PostAuthLoginResponse } from '@src/api/auth/AuthApi.types';
import { ACCESS_STORE_ID, ACCESS_TOKEN_KEY } from '@src/constants/api/authKey';

interface IValidUser {
  id: string;
  pw: string;
  storeId: number;
}

const validUserList: IValidUser[] = [
  {
    id: process.env.NEXT_PUBLIC_TMP_LOGIN_ID,
    pw: process.env.NEXT_PUBLIC_TMP_LOGIN_PW,
    storeId: Number(process.env.NEXT_PUBLIC_TMP_STORE_ID),
  },
  {
    id: process.env.NEXT_PUBLIC_TMP_LOGIN_ID_2,
    pw: process.env.NEXT_PUBLIC_TMP_LOGIN_PW_2,
    storeId: Number(process.env.NEXT_PUBLIC_TMP_STORE_ID_2),
  },
];

const isValidId = (id: string): boolean => !!validUserList.find((item) => id === item.id);

const isValidPassword = (id: string, pw: string): boolean =>
  !!validUserList.find((item) => id === item.id && pw === item.pw);

const getValidStoreId = (id: string): number | null => {
  const valid = validUserList.find((item) => id === item.id);
  if (!valid) return null;
  return Number(valid.storeId);
};

const ApiAuthLoginHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<PostAuthLoginResponse | PostAuthError>,
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ errorMessage: 'METHOD WRONG' });
  }

  try {
    const { id, pw } = req.body as PostAuthLoginRequest;

    if (!isValidId(id)) {
      return res.status(401).json({ errorMessage: '아이디가 잘못되었습니다.' });
    }

    if (!isValidPassword(id, pw)) {
      return res.status(401).json({ errorMessage: '비밀번호가 잘못되었습니다.' });
    }

    const storeId = getValidStoreId(id);

    if (!storeId) {
      return res.status(404).json({ errorMessage: '등록된 스토어 ID가 없습니다.' });
    }

    const token = await new SignJWT({ id, storeId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY));

    const authCookie = serialize(ACCESS_TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
      sameSite: 'strict',
    });

    const storeCookie = serialize(ACCESS_STORE_ID, String(storeId), {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 365, // 365일
      path: '/',
      sameSite: 'strict',
    });

    res.setHeader('Set-Cookie', [authCookie, storeCookie]);

    return res.status(200).json({ token });
  } catch (err) {
    console.error('ERROR', err);
    return res.status(500).json({ errorMessage: 'INTERNAL SERVER ERROR' });
  }
};

export default ApiAuthLoginHandler;
