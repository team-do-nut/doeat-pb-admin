import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import PbInventoryApi from '@src/api/pb/inventory/PbInventory';
import type {
  InventoryType,
  PbItemTaxType,
  PbItemType,
  PostInventoryRecordRequest,
} from '@src/api/pb/inventory/PbInventory.types';
import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import FormInputDateRange from '@src/components/form/FormInputDateRange';
import FormInputSelect from '@src/components/form/FormInputSelect';
import FormInputText from '@src/components/form/FormInputText';

import InventoryNavigation from '../_components/InventoryNavigation';
import { INVENTORY_TYPE_SELECT_OPTIONS } from '../_core/options';
import S from '../_styles';
import { getInventoryItemTypeLabel, getInventoryTaxTypeLabel } from '../_utils/parse';

interface InventoryRecordHistoryFormFields {
  newData: {
    itemId: number;
    itemName: string;
    unit: string;
    date: string;
    quantity: string;
    taxType: PbItemTaxType;
    itemType: PbItemType;
    inventoryType: InventoryType;
  }[][];
}

const InventoryRecordHistoryPage = () => {
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [inventoryType, setInventoryType] = useState<InventoryType>('INCOME');

  const { register, control, setValue, getValues } = useForm<InventoryRecordHistoryFormFields>({
    defaultValues: {
      newData: [],
    },
  });

  const { fields: newDataFields } = useFieldArray({ control, name: 'newData' });

  const queryClient = useQueryClient();

  const { data: inventoryRecordsData, status: inventoryRecordsDataStatus } = useQuery({
    queryKey: [PbInventoryApi.getInventoryRecordsApiKey, { start: startDate, end: endDate }] as const,
    queryFn: ({ queryKey: [, { start, end }] }) => PbInventoryApi.getInventoryRecords({ start, end }),
    enabled: !!startDate && !!endDate,
  });

  const { data: allItemsData, status: allItemsDataStatus } = useQuery({
    queryKey: [PbInventoryApi.getAllItemsApiKey],
    queryFn: () => PbInventoryApi.getAllItems(),
  });

  const onMutateSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: [PbInventoryApi.getInventoryRecordsApiKey],
    });
    alert('저장 성공');
  }, [queryClient]);

  const onMutateError = useCallback(() => {
    alert('재고 히스토리를 저장하는데 실패했습니다.');
  }, []);

  const { mutate: postInventoryRecords } = useMutation({
    mutationFn: PbInventoryApi.postInventoryRecords,
    onSuccess: onMutateSuccess,
    onError: onMutateError,
  });

  const onInventoryTypeChange = useCallback((value: string) => {
    setInventoryType(value as InventoryType);
  }, []);

  const onDateRangeChange = useCallback(({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const onUpsertClick = useCallback(
    (dateIndex: number) => () => {
      const values = getValues(`newData.${dateIndex}`);
      const transformedData: PostInventoryRecordRequest[] = values.map(({ date, itemId, quantity, inventoryType }) => ({
        date,
        itemId,
        quantity: Number(quantity),
        type: inventoryType,
      }));

      postInventoryRecords(transformedData);
    },
    [getValues, postInventoryRecords],
  );

  useEffect(() => {
    if (allItemsData) {
      const dates: string[] = [];
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      let currentDate = start;
      while (currentDate.isSame(end) || currentDate.isBefore(end)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
      }

      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // 내림차순

      const transformedData: InventoryRecordHistoryFormFields['newData'] = dates.map((dateStr) =>
        allItemsData.map(({ id, name, unit, taxType, type }) => ({
          itemId: id,
          unit,
          itemName: name,
          itemType: type,
          taxType,
          // 받아야 하는 것
          quantity: '0',
          date: dateStr,
          inventoryType: 'INCOME',
        })),
      );

      if (inventoryRecordsData && inventoryRecordsData.length > 0) {
        for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
          const currentDate = dates[dateIndex];

          const currentDatePriceHistory = inventoryRecordsData.filter((item) => item.date === currentDate);

          for (let itemIndex = 0; itemIndex < transformedData[dateIndex].length; itemIndex++) {
            const currentItem = transformedData[dateIndex][itemIndex];

            const historyItem = currentDatePriceHistory.find((histItem) => histItem.itemId === currentItem.itemId);

            if (historyItem) {
              transformedData[dateIndex][itemIndex] = {
                ...currentItem,

                quantity: String(historyItem.quantity),
                date: historyItem.date,
                inventoryType: historyItem.type,
              };
            }
          }
        }
      }

      setValue('newData', transformedData);
    }
  }, [allItemsData, endDate, inventoryRecordsData, setValue, startDate]);

  return (
    <>
      <Head>
        <title>PB | 재고 히스토리</title>
        <meta name="description" content="Doeat PB Admin Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <S.PageContainer>
        <Navigation />
        <InventoryNavigation />

        <S.ContentContainer>
          <S.SectionCard>
            <S.PageTitle>재고 현황</S.PageTitle>

            <S.FilterContainer>
              <S.FilterInputContainer>
                <FormInputDateRange value={{ startDate, endDate }} onChange={onDateRangeChange} />
                <FormInputSelect
                  options={INVENTORY_TYPE_SELECT_OPTIONS}
                  value={inventoryType}
                  onChange={onInventoryTypeChange}
                />
              </S.FilterInputContainer>
            </S.FilterContainer>

            <div>
              {inventoryRecordsDataStatus === 'success' &&
                allItemsDataStatus === 'success' &&
                newDataFields.length > 0 &&
                newDataFields.map((dateGroup, dateIndex) => {
                  const dateItems = getValues(`newData.${dateIndex}`);
                  const { date } = dateItems[0];

                  return (
                    <div key={dateGroup.id}>
                      <S.DateHeader>{date} 재고 현황</S.DateHeader>
                      <S.TableContainer>
                        <S.Table>
                          <colgroup>
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="10%" />
                          </colgroup>
                          <S.TableHeader>
                            <tr>
                              <S.TableHeaderCell>아이템 ID</S.TableHeaderCell>
                              <S.TableHeaderCell>이름</S.TableHeaderCell>
                              <S.TableHeaderCell>단위</S.TableHeaderCell>
                              <S.TableHeaderCell>날짜</S.TableHeaderCell>
                              <S.TableHeaderCell>세금 타입</S.TableHeaderCell>
                              <S.TableHeaderCell>아이템 타입</S.TableHeaderCell>
                              <S.TableHeaderCell>양</S.TableHeaderCell>
                              <S.TableHeaderCell>타입</S.TableHeaderCell>
                            </tr>
                          </S.TableHeader>
                          <S.TableBody>
                            {dateItems.map((item, itemIndex) => (
                              <S.TableRow key={`${item.itemId}-${item.date}`}>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.itemId} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.itemName} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.unit} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.date} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={getInventoryTaxTypeLabel(item.taxType)} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={getInventoryItemTypeLabel(item.itemType)} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText {...register(`newData.${dateIndex}.${itemIndex}.quantity`)} />
                                </S.TableCell>
                                <S.TableCell>
                                  <Controller
                                    control={control}
                                    name={`newData.${dateIndex}.${itemIndex}.inventoryType`}
                                    render={({ field: { value, onChange } }) => (
                                      <FormInputSelect
                                        options={INVENTORY_TYPE_SELECT_OPTIONS}
                                        value={value}
                                        onChange={onChange}
                                      />
                                    )}
                                  />
                                </S.TableCell>
                              </S.TableRow>
                            ))}
                          </S.TableBody>
                        </S.Table>
                      </S.TableContainer>
                      <BigSquareButton style={{ width: '100%' }} variant="primary" onClick={onUpsertClick(dateIndex)}>
                        저장 및 수정
                      </BigSquareButton>
                    </div>
                  );
                })}

              {(inventoryRecordsDataStatus === 'pending' || allItemsDataStatus === 'pending') && (
                <S.NoDataMessage>로딩중</S.NoDataMessage>
              )}
              {(inventoryRecordsDataStatus === 'error' || allItemsDataStatus === 'error') && (
                <S.NoDataMessage>데이터를 불러오는데 실패했습니다.</S.NoDataMessage>
              )}
            </div>
          </S.SectionCard>
        </S.ContentContainer>
      </S.PageContainer>
    </>
  );
};

export default InventoryRecordHistoryPage;
