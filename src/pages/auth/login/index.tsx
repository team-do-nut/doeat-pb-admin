import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';

import AuthApi from '@src/api/auth/AuthApi';
import { PostAuthError } from '@src/api/auth/AuthApi.types';
import BigSquareButton from '@src/components/button/BigSquareButton';
import FormInputText from '@src/components/form/FormInputText';
import { setAccessToken } from '@src/libs/axios/apiClient';

import S from './_styles';

interface AuthLoginFormFields {
  id: string;
  pw: string;
}

const AuthLoginPage = () => {
  const { replace } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLoginFormFields>();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: AuthApi.postAuthLogin,
    onSuccess: ({ data: { token } }) => {
      setAccessToken(token);
      replace('/', undefined, { shallow: false, scroll: true });
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        alert((err.response?.data as PostAuthError).errorMessage);
      } else {
        alert('UNKNOWN_ERROR');
      }
    },
  });

  const onSubmit = useCallback<SubmitHandler<AuthLoginFormFields>>(
    ({ id, pw }) => {
      loginMutate({ id, pw });
    },
    [loginMutate],
  );

  return (
    <S.LoginContainer>
      <S.LoginCard>
        <S.LoginTitle>두잇 PB 어드민 로그인</S.LoginTitle>
        <S.LoginForm onSubmit={handleSubmit(onSubmit)}>
          <FormInputText
            {...register('id', { required: '아이디를 입력해주세요' })}
            label="아이디"
            placeholder="아이디를 입력하세요"
            errorMessage={errors.id?.message}
          />
          <FormInputText
            {...register('pw', { required: '비밀번호를 입력해주세요' })}
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            errorMessage={errors.pw?.message}
          />
          <BigSquareButton type="submit" variant="primary" fullWidth isLoading={isPending}>
            로그인
          </BigSquareButton>
        </S.LoginForm>
      </S.LoginCard>
    </S.LoginContainer>
  );
};

export default AuthLoginPage;
