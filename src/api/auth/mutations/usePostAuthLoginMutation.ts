import { useMutation } from '@tanstack/react-query';
import AuthApi from '../AuthApi';

function usePostAuthLoginMutation() {
  return useMutation({
    mutationFn: AuthApi.postAuthLogin,
  });
}

export default usePostAuthLoginMutation;
