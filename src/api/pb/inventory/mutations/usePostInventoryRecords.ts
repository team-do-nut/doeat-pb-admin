import { useMutation, useQueryClient } from '@tanstack/react-query';
import PbInventoryApi from '../PbInventory';

function usePostInventoryRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PbInventoryApi.postInventoryRecords,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PbInventoryApi.getInventoryRecordsApiKey],
      });
      alert('저장 성공');
    },
    onError: () => {
      alert('재고 히스토리를 저장하는데 실패했습니다.');
    },
  });
}

export default usePostInventoryRecords;
