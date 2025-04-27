import { useQuery } from '@tanstack/react-query';
import PbInventoryApi from '../PbInventory';

interface UsePbInventoryItemHistoryQueryProps {
  startDate: string;
  endDate: string;
}

function usePbInventoryItemHistoryQuery({ startDate, endDate }: UsePbInventoryItemHistoryQueryProps) {
  return useQuery({
    queryKey: [PbInventoryApi.getItemPriceHistoryApiKey, { start: startDate, end: endDate }] as const,
    queryFn: ({ queryKey: [, { start, end }] }) => PbInventoryApi.getItemPriceHistory({ start, end }),
    enabled: !!startDate && !!endDate,
  });
}

export default usePbInventoryItemHistoryQuery;
