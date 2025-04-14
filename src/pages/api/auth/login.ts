import { serialize } from 'cookie';
import { SignJWT } from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';
import { PostAuthError, PostAuthLoginRequest, PostAuthLoginResponse } from '@src/api/auth/AuthApi.types';

const ApiAuthLoginHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<PostAuthLoginResponse | PostAuthError>,
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ errorMessage: 'METHOD WRONG' });
  }

  try {
    const { id, pw } = req.body as PostAuthLoginRequest;

    if (id !== process.env.NEXT_PUBLIC_TMP_LOGIN_ID) {
      return res.status(401).json({ errorMessage: '아이디가 잘못되었습니다.' });
    }

    if (pw !== process.env.NEXT_PUBLIC_TMP_LOGIN_PW) {
      return res.status(401).json({ errorMessage: '비밀번호가 잘못되었습니다.' });
    }

    const token = await new SignJWT({ id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET_KEY));

    const cookie = serialize('doeat_pb_access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'strict',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ token });
  } catch (err) {
    console.error('ERROR', err);
    return res.status(500).json({ errorMessage: 'INTERNAL SERVER ERROR' });
  }
};

export default ApiAuthLoginHandler;
