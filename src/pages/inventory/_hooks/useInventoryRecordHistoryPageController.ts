import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useFieldArray, useForm } from 'react-hook-form';

import { InventoryType, PostInventoryRecordRequest } from '@src/api/pb/inventory/PbInventory.types';
import usePostInventoryRecords from '@src/api/pb/inventory/mutations/usePostInventoryRecords';
import usePbInventoryItemQuery from '@src/api/pb/inventory/queries/usePbInventoryItemQuery';
import usePbInventoryRecordQuery from '@src/api/pb/inventory/queries/usePbInventoryRecordQuery';
import { useStore } from '@src/core/StoreProvider';
import { isValidEmpty, isValidNumber } from '@src/utils/valid';

interface InventoryRecordHistoryFormFields {
  newData: {
    itemId: number;
    itemName: string;
    unit: string;
    date: string;
    quantity: string;
    inventoryType: InventoryType | '';
  }[][];
}

function useInventoryRecordHistoryPageController() {
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [inventoryType, setInventoryType] = useState<InventoryType | ''>('');

  const { register, control, setValue, getValues } = useForm<InventoryRecordHistoryFormFields>({
    defaultValues: {
      newData: [],
    },
  });

  const { fields: newDataFields } = useFieldArray({ control, name: 'newData' });

  const { storeId } = useStore();

  const allItemsQuery = usePbInventoryItemQuery();

  const inventoryRecordsQuery = usePbInventoryRecordQuery({
    startDate,
    endDate,
  });

  const { mutateAsync: postInventoryRecords } = usePostInventoryRecords();

  const onInventoryTypeChange = useCallback((value: string) => {
    setInventoryType(value as InventoryType);
  }, []);

  const onDateRangeChange = useCallback(({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const onUpsertClick = useCallback(
    (dateIndex: number) => () => {
      if (!storeId) return;

      const values = getValues(`newData.${dateIndex}`);

      if (values.some(({ quantity, inventoryType }) => !isValidEmpty([quantity, inventoryType]))) {
        alert('입력을 채워주세요');
        return;
      }

      if (values.some(({ quantity }) => !isValidNumber(quantity))) {
        alert('양은 숫자만 입력해주세요');
        return;
      }

      const transformedData: PostInventoryRecordRequest[] = values.map(({ date, itemId, quantity, inventoryType }) => ({
        date,
        itemId,
        quantity: Number(quantity),
        type: inventoryType as InventoryType,
        storeId,
      }));

      postInventoryRecords(transformedData);
    },
    [getValues, postInventoryRecords, storeId],
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

      const inventoryTypes: InventoryType[] = ['INCOME', 'STOCK'];
      const dateGroups: Record<string, any[]> = {};

      for (const dateStr of dates) {
        dateGroups[dateStr] = [];

        for (const type of inventoryTypes) {
          const itemsForDateAndType = allItemsQuery.data.map(({ id, name, unit }) => ({
            itemId: id,
            unit,
            itemName: name,
            quantity: '0',
            date: dateStr,
            inventoryType: type, // 미리 타입 설정
          }));

          // 날짜 그룹에 해당 타입의 아이템 배열 추가
          dateGroups[dateStr].push(...itemsForDateAndType);
        }
      }

      // 날짜별 그룹을 배열로 변환
      const transformedData: InventoryRecordHistoryFormFields['newData'] = Object.values(dateGroups);

      // 실제 데이터로 업데이트
      if (inventoryRecordsQuery.data && inventoryRecordsQuery.data.length > 0) {
        for (let dateIndex = 0; dateIndex < transformedData.length; dateIndex++) {
          if (transformedData[dateIndex].length === 0) continue;

          const currentDate = transformedData[dateIndex][0].date;

          const recordsForDate = inventoryRecordsQuery.data.filter((record) => record.date === currentDate);

          for (let itemIndex = 0; itemIndex < transformedData[dateIndex].length; itemIndex++) {
            const currentItem = transformedData[dateIndex][itemIndex];

            const matchingRecord = recordsForDate.find(
              (record) => record.itemId === currentItem.itemId && record.type === currentItem.inventoryType,
            );

            if (matchingRecord) {
              transformedData[dateIndex][itemIndex] = {
                ...currentItem,
                quantity: String(matchingRecord.quantity),
              };
            }
          }
        }
      }

      // inventoryType 필터에 따른 필터링
      if (inventoryType) {
        const filteredData = transformedData
          .map((dateGroup) => dateGroup.filter((item) => item.inventoryType === inventoryType))
          .filter((group) => group.length > 0); // 빈 그룹 제거

        setValue('newData', filteredData);
      } else {
        setValue('newData', transformedData);
      }
    }
  }, [allItemsQuery.data, endDate, inventoryRecordsQuery.data, setValue, startDate, inventoryType]);

  return {
    startDate,
    endDate,
    inventoryType,
    register,
    control,
    setValue,
    getValues,
    newDataFields,
    allItemsQuery,
    inventoryRecordsQuery,
    postInventoryRecords,
    onInventoryTypeChange,
    onDateRangeChange,
    onUpsertClick,
  };
}

export default useInventoryRecordHistoryPageController;
