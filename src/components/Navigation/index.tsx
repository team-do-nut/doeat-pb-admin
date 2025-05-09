import { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import AuthApi from '@src/api/auth/AuthApi';
import { PostAuthError } from '@src/api/auth/AuthApi.types';
import { useStore } from '@src/core/StoreProvider';
import { clearAccessToken } from '@src/libs/axios/apiClient';
import * as S from './styles';

const Navigation: FC = () => {
  const { replace, pathname } = useRouter();
  const { setStoreId } = useStore();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: AuthApi.postAuthLogout,
    onSuccess: () => {
      clearAccessToken();
      setStoreId(null);
      replace('/auth/login');
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        alert((err.response?.data as PostAuthError).errorMessage);
      } else {
        alert('UNKNOWN_ERROR');
      }
    },
  });

  const onLogoutClick = useCallback(() => {
    logoutMutate();
  }, [logoutMutate]);

  return (
    <S.NavContainer>
      <S.NavLinks>
        <S.StyledLink href="/" selected={pathname === '/'}>
          홈
        </S.StyledLink>
        <S.StyledLink href="/inventory" selected={pathname.startsWith('/inventory')}>
          재고 관리
        </S.StyledLink>
      </S.NavLinks>

      {process.env.NODE_ENV !== 'production' && <S.HiddenTitle>DEV 환경</S.HiddenTitle>}
      <S.LogoutButton onClick={onLogoutClick}>로그아웃</S.LogoutButton>
    </S.NavContainer>
  );
};

export default Navigation;
