import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useFieldArray, useForm } from 'react-hook-form';

import { PostItemPriceHistoryCreateRequest } from '@src/api/pb/inventory/PbInventory.types';
import usePostItemPriceHistoryMutation from '@src/api/pb/inventory/mutations/usePostItemPriceHistoryMutation';
import usePbInventoryItemHistoryQuery from '@src/api/pb/inventory/queries/usePbInventoryItemHistoryQuery';
import usePbInventoryItemQuery from '@src/api/pb/inventory/queries/usePbInventoryItemQuery';
import { isValidEmpty, isValidNumber } from '@src/utils/valid';

interface InventoryPriceHistoryFormFields {
  historyData: {
    itemId: number;
    itemName: string;
    date: string;
    unit: string;
    price: string;
  }[][];
}

function useInventoryPriceHistoryPageController() {
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

  const { register, control, setValue, getValues } = useForm<InventoryPriceHistoryFormFields>({
    defaultValues: {
      historyData: [],
    },
  });

  const { fields: historyDataFields } = useFieldArray({ control, name: 'historyData' });

  const allItemsQuery = usePbInventoryItemQuery();

  const itemPriceHistoryQuery = usePbInventoryItemHistoryQuery({
    startDate,
    endDate,
  });

  const { mutateAsync: postItemPriceHistory } = usePostItemPriceHistoryMutation();

  const onDateRangeChange = useCallback(({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const onUpsertClick = useCallback(
    (dateIndex: number) => () => {
      const values = getValues(`historyData.${dateIndex}`);

      if (values.some(({ date, price }) => !isValidEmpty([date, price]))) {
        alert('입력을 전부 채워주세요');
        return;
      }

      if (values.some(({ price }) => !isValidNumber(price))) {
        alert('가격은 숫자만 입력해주세요');
        return;
      }

      const transformedData: PostItemPriceHistoryCreateRequest[] = values.map(({ date, itemId, price }) => ({
        date,
        itemId,
        price: Number(price),
      }));

      postItemPriceHistory(transformedData);
    },
    [getValues, postItemPriceHistory],
  );

  useEffect(() => {
    if (allItemsQuery.data && allItemsQuery.data.length > 0) {
      const dates: string[] = [];
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      let currentDate = start;
      while (currentDate.isSame(end) || currentDate.isBefore(end)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
      }

      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // 내림차순

      const transformedData: InventoryPriceHistoryFormFields['historyData'] = dates.map((dateStr) =>
        allItemsQuery.data.map(({ id, name, unit }) => ({
          itemId: id,
          itemName: name,
          date: dateStr,
          price: '0', // 기본 가격은 0
          unit,
        })),
      );

      if (itemPriceHistoryQuery.data && itemPriceHistoryQuery.data.length > 0) {
        for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
          const currentDate = dates[dateIndex];

          const currentDatePriceHistory = itemPriceHistoryQuery.data.filter((item) => item.date === currentDate);

          for (let itemIndex = 0; itemIndex < transformedData[dateIndex].length; itemIndex++) {
            const currentItem = transformedData[dateIndex][itemIndex];

            const historyItem = currentDatePriceHistory.find((histItem) => histItem.itemId === currentItem.itemId);

            if (historyItem) {
              transformedData[dateIndex][itemIndex] = {
                ...currentItem,

                price: String(historyItem.price),
              };
            }
          }
        }
      }

      setValue('historyData', transformedData);
    }
  }, [allItemsQuery.data, startDate, endDate, itemPriceHistoryQuery.data, setValue]);

  return {
    startDate,
    endDate,
    register,
    getValues,

    historyDataFields,

    allItemsQuery,
    itemPriceHistoryQuery,

    onDateRangeChange,
    onUpsertClick,
  };
}

export default useInventoryPriceHistoryPageController;
