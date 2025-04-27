import { useMutation, useQueryClient } from '@tanstack/react-query';
import PbInventoryApi from '../PbInventory';

function usePostItemPriceHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PbInventoryApi.postItemPriceHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PbInventoryApi.getItemPriceHistoryApiKey] });
      alert('저장되었습니다.');
    },
    onError: () => {
      alert('저장하는데 실패했습니다.');
    },
  });
}

export default usePostItemPriceHistoryMutation;
