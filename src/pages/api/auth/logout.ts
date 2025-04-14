import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { PostAuthError } from '@src/api/auth/AuthApi.types';

const ApiAuthLogoutHandler = async (req: NextApiRequest, res: NextApiResponse<null | PostAuthError>) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ errorMessage: 'METHOD WRONG' });
  }

  try {
    const cookie = serialize('doeat_pb_access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json(null);
  } catch (err) {
    console.error('LOGOUT ERROR', err);
    return res.status(500).json({ errorMessage: 'INTERNAL SERVER ERROR' });
  }
};

export default ApiAuthLogoutHandler;
