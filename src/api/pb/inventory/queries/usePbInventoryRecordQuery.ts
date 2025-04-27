import { useQuery } from '@tanstack/react-query';
import PbInventoryApi from '../PbInventory';

interface UsePbInventoryRecordQueryProps {
  startDate: string;
  endDate: string;
}

function usePbInventoryRecordQuery({ startDate, endDate }: UsePbInventoryRecordQueryProps) {
  return useQuery({
    queryKey: [PbInventoryApi.getInventoryRecordsApiKey, { start: startDate, end: endDate }] as const,
    queryFn: ({ queryKey: [, { start, end }] }) => PbInventoryApi.getInventoryRecords({ start, end }),
    enabled: !!startDate && !!endDate,
  });
}

export default usePbInventoryRecordQuery;
