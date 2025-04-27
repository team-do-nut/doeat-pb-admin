import { useQuery } from '@tanstack/react-query';
import PbInventoryApi from '../PbInventory';

function usePbInventoryItemQuery() {
  return useQuery({
    queryKey: [PbInventoryApi.getAllItemsApiKey],
    queryFn: () => PbInventoryApi.getAllItems(),
  });
}

export default usePbInventoryItemQuery;
