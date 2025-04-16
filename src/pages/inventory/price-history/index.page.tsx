import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFieldArray, useForm } from 'react-hook-form';

import PbInventoryApi from '@src/api/pb/inventory/PbInventory';
import { PostItemPriceHistoryCreateRequest } from '@src/api/pb/inventory/PbInventory.types';
import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import FormInputDateRange from '@src/components/form/FormInputDateRange';
import FormInputText from '@src/components/form/FormInputText';
import { isValidEmpty, isValidNumber } from '@src/utils/valid';

import InventoryNavigation from '../_components/InventoryNavigation';
import S from '../_styles';

interface InventoryPriceHistoryFormFields {
  historyData: {
    itemId: number;
    itemName: string;
    date: string;
    unit: string;
    price: string;
  }[][];
}

const InventoryPriceHistoryPage = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

  const { register, control, setValue, getValues } = useForm<InventoryPriceHistoryFormFields>({
    defaultValues: {
      historyData: [],
    },
  });

  const { fields: historyDataFields } = useFieldArray({ control, name: 'historyData' });

  const queryClient = useQueryClient();

  const { data: itemPriceHistoryData, status: itemPriceHistoryDataStatus } = useQuery({
    queryKey: [PbInventoryApi.getItemPriceHistoryApiKey, { start: startDate, end: endDate }] as const,
    queryFn: ({ queryKey: [, { start, end }] }) => PbInventoryApi.getItemPriceHistory({ start, end }),
    enabled: !!startDate && !!endDate,
  });

  const { data: allItemsData, status: allItemsDataStatus } = useQuery({
    queryKey: [PbInventoryApi.getAllItemsApiKey],
    queryFn: () => PbInventoryApi.getAllItems(),
  });

  const { mutate: postItemPriceHistory } = useMutation({
    mutationFn: PbInventoryApi.postItemPriceHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PbInventoryApi.getItemPriceHistoryApiKey] });
      alert('저장되었습니다.');
    },
    onError: () => {
      alert('저장하는데 실패했습니다.');
    },
  });

  const onDateRangeChange = useCallback(({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  /*단가_히스토리_추가 */
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
    if (allItemsData && allItemsData.length > 0) {
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
        allItemsData.map(({ id, name, unit }) => ({
          itemId: id,
          itemName: name,
          date: dateStr,
          price: '0', // 기본 가격은 0
          unit,
        })),
      );

      if (itemPriceHistoryData && itemPriceHistoryData.length > 0) {
        for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
          const currentDate = dates[dateIndex];

          const currentDatePriceHistory = itemPriceHistoryData.filter((item) => item.date === currentDate);

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
  }, [allItemsData, startDate, endDate, itemPriceHistoryData, setValue]);

  return (
    <>
      <Head>
        <title>PB | 단가 히스토리</title>
        <meta name="description" content="Doeat PB Admin Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <S.PageContainer>
        <Navigation />
        <InventoryNavigation />

        <S.ContentContainer>
          <S.SectionCardWrapper>
            <S.SectionCard>
              <S.PageTitle>단가 현황</S.PageTitle>

              <S.FilterContainer>
                <S.FilterInputContainer>
                  <FormInputDateRange value={{ startDate, endDate }} onChange={onDateRangeChange} />
                </S.FilterInputContainer>
              </S.FilterContainer>

              <div>
                {itemPriceHistoryDataStatus === 'success' &&
                  allItemsDataStatus === 'success' &&
                  historyDataFields.length > 0 &&
                  historyDataFields.map((dateGroup, dateIndex) => {
                    const dateItems = getValues(`historyData.${dateIndex}`);

                    const { date } = dateItems[0];

                    return (
                      <div key={dateGroup.id}>
                        <S.DateHeader>{date} 단가 현황</S.DateHeader>
                        <S.TableContainer>
                          <S.Table>
                            <colgroup>
                              <col width="20%" />
                              <col width="20%" />
                              <col width="20%" />
                              <col width="20%" />
                              <col width="20%" />
                            </colgroup>
                            <S.TableHeader>
                              <tr>
                                <S.TableHeaderCell>아이템 ID</S.TableHeaderCell>
                                <S.TableHeaderCell>이름</S.TableHeaderCell>
                                <S.TableHeaderCell>날짜</S.TableHeaderCell>
                                <S.TableHeaderCell>단위</S.TableHeaderCell>
                                <S.TableHeaderCell>가격</S.TableHeaderCell>
                              </tr>
                            </S.TableHeader>
                            <S.TableBody>
                              {dateItems.map((item, itemIndex) => (
                                <S.TableRow key={`${item.itemId}-${item.date}`}>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`historyData.${dateIndex}.${itemIndex}.itemId`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`historyData.${dateIndex}.${itemIndex}.itemName`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`historyData.${dateIndex}.${itemIndex}.date`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`historyData.${dateIndex}.${itemIndex}.unit`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText {...register(`historyData.${dateIndex}.${itemIndex}.price`)} />
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

                {itemPriceHistoryDataStatus === 'success' &&
                  allItemsDataStatus === 'success' &&
                  historyDataFields.length === 0 && <S.NoDataMessage>데이터가 존재하지 않습니다.</S.NoDataMessage>}

                {(itemPriceHistoryDataStatus === 'pending' || allItemsDataStatus === 'pending') && (
                  <S.NoDataMessage>로딩중</S.NoDataMessage>
                )}

                {(itemPriceHistoryDataStatus === 'error' || allItemsDataStatus === 'error') && (
                  <S.NoDataMessage>데이터를 불러오는데 실패했습니다</S.NoDataMessage>
                )}
              </div>
            </S.SectionCard>
          </S.SectionCardWrapper>
        </S.ContentContainer>
      </S.PageContainer>
    </>
  );
};

export default InventoryPriceHistoryPage;
