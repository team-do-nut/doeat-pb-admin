import { useMutation, useQueryClient } from '@tanstack/react-query';
import PbInventoryApi from '../PbInventory';

function usePbInventoryPostItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PbInventoryApi.postItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PbInventoryApi.getAllItemsApiKey] });
      alert('재료 품목 생성 완료!');
    },
    onError: () => {
      alert('재료 품목 생성하는데 실패했습니다.');
    },
  });
}

export default usePbInventoryPostItemMutation;
