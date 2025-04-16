import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import PbInventoryApi from '@src/api/pb/inventory/PbInventory';
import {
  GetItemPriceHistoryResponse,
  PostItemPriceHistoryCreateRequest,
} from '@src/api/pb/inventory/PbInventory.types';
import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import FormInputDate from '@src/components/form/FormInputDate';
import FormInputDateRange from '@src/components/form/FormInputDateRange';
import FormInputText from '@src/components/form/FormInputText';

import InventoryNavigation from '../_components/InventoryNavigation';
import InventoryTab from '../_components/InventoryTab';
import { INVENTORY_ITEM_HISTORY_TAB_ITEMS } from '../_core/options';
import S from '../_styles';

interface InventoryPriceHistoryFormFields {
  historyData: {
    itemId: number;
    itemName: string;
    date: string;
    price: string;
  }[];
}

const InventoryPriceHistoryPage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

  const { register, control, handleSubmit, setValue } = useForm<InventoryPriceHistoryFormFields>({
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

  /* 공통_탭 */
  const onTabChange = useCallback((value: number) => {
    setActiveTab(value);
  }, []);

  /* 단가_히스토리_조회 */
  const groupedItemPriceHistoryData = useMemo(() => {
    if (!itemPriceHistoryData) return null;

    const groupedByDate = itemPriceHistoryData?.reduce<Record<string, GetItemPriceHistoryResponse[]>>((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return {
      groupedByDate,
      sortedDates,
    };
  }, [itemPriceHistoryData]);

  const onDateRangeChange = useCallback(({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  /*단가_히스토리_추가 */
  const onDateChange = useCallback((value: string) => {
    setDate(value);
  }, []);

  const onAddSubmit = useCallback<SubmitHandler<InventoryPriceHistoryFormFields>>(
    ({ historyData }) => {
      const transformedData: PostItemPriceHistoryCreateRequest[] = historyData.map(({ date, itemId, price }) => ({
        date,
        itemId,
        price: Number(price),
      }));

      postItemPriceHistory(transformedData);
    },
    [postItemPriceHistory],
  );

  useEffect(() => {
    if (allItemsData) {
      const transformedData: InventoryPriceHistoryFormFields['historyData'] = allItemsData.map(({ id, name }) => ({
        itemId: id,
        itemName: name,
        // 추가해야할 것
        date,
        price: '0',
      }));

      setValue('historyData', transformedData);
    }
  }, [allItemsData, date, itemPriceHistoryData, setValue]);

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
        <InventoryTab items={INVENTORY_ITEM_HISTORY_TAB_ITEMS} activeTab={activeTab} onTabChange={onTabChange} />

        <S.ContentContainer>
          <S.SectionCardWrapper>
            {activeTab === 0 && (
              <S.SectionCard>
                <S.PageTitle>단가 현황</S.PageTitle>

                <S.FilterContainer>
                  <S.FilterInputContainer>
                    <FormInputDateRange value={{ startDate, endDate }} onChange={onDateRangeChange} />
                  </S.FilterInputContainer>
                </S.FilterContainer>

                <div>
                  {itemPriceHistoryDataStatus === 'success' &&
                    !!groupedItemPriceHistoryData &&
                    groupedItemPriceHistoryData.sortedDates.length > 0 &&
                    groupedItemPriceHistoryData.sortedDates.map((date) => (
                      <div key={date}>
                        <S.DateHeader>{date} 단가 현황</S.DateHeader>
                        <S.TableContainer>
                          <S.Table>
                            <colgroup>
                              <col width="10%" />
                              <col width="10%" />
                              <col width="10%" />
                              <col width="10%" />
                            </colgroup>
                            <S.TableHeader>
                              <tr>
                                <S.TableHeaderCell>ID</S.TableHeaderCell>
                                <S.TableHeaderCell>아이템 ID</S.TableHeaderCell>
                                <S.TableHeaderCell>이름</S.TableHeaderCell>
                                <S.TableHeaderCell>가격</S.TableHeaderCell>
                              </tr>
                            </S.TableHeader>
                            <S.TableBody>
                              {groupedItemPriceHistoryData.groupedByDate[date].map((item) => (
                                <S.TableRow key={item.id}>
                                  <S.TableCell>
                                    <FormInputText readOnly defaultValue={item.id} />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText readOnly defaultValue={item.itemId} />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText readOnly defaultValue={item.itemName} />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText readOnly defaultValue={item.price} />
                                  </S.TableCell>
                                </S.TableRow>
                              ))}
                            </S.TableBody>
                          </S.Table>
                        </S.TableContainer>
                      </div>
                    ))}

                  {itemPriceHistoryDataStatus === 'success' &&
                    (!groupedItemPriceHistoryData || itemPriceHistoryData.length === 0) && (
                      <S.NoDataMessage>단가 히스토리 데이터가 존재하지 않습니다.</S.NoDataMessage>
                    )}

                  {itemPriceHistoryDataStatus === 'pending' && <S.NoDataMessage>로딩중</S.NoDataMessage>}

                  {itemPriceHistoryDataStatus === 'error' && (
                    <S.NoDataMessage>데이터를 불러오는데 실패했습니다</S.NoDataMessage>
                  )}
                </div>
              </S.SectionCard>
            )}

            {activeTab === 1 && (
              <S.SectionCard>
                <S.PageTitle>단가 추가</S.PageTitle>

                <S.FilterContainer>
                  <S.FilterInputContainer>
                    <FormInputDate value={date} onChange={onDateChange} />
                  </S.FilterInputContainer>
                </S.FilterContainer>

                <div style={{ marginBottom: '40px' }}>
                  <S.TableContainer>
                    <S.Table>
                      <S.TableHeader>
                        <tr>
                          <S.TableHeaderCell>아이템 ID</S.TableHeaderCell>
                          <S.TableHeaderCell>이름</S.TableHeaderCell>
                          <S.TableHeaderCell>날짜</S.TableHeaderCell>
                          <S.TableHeaderCell>가격</S.TableHeaderCell>
                        </tr>
                      </S.TableHeader>

                      <S.TableBody>
                        {allItemsDataStatus === 'success' &&
                          historyDataFields.length > 0 &&
                          historyDataFields.map(({ id }, index) => (
                            <S.TableRow key={id}>
                              <S.TableCell>
                                <FormInputText readOnly {...register(`historyData.${index}.itemId`)} />
                              </S.TableCell>
                              <S.TableCell>
                                <FormInputText readOnly {...register(`historyData.${index}.itemName`)} />
                              </S.TableCell>
                              <S.TableCell>
                                <FormInputText readOnly {...register(`historyData.${index}.date`)} />
                              </S.TableCell>
                              <S.TableCell>
                                <FormInputText {...register(`historyData.${index}.price`)} />
                              </S.TableCell>
                            </S.TableRow>
                          ))}
                      </S.TableBody>
                    </S.Table>
                  </S.TableContainer>

                  <BigSquareButton style={{ width: '100%' }} variant="primary" onClick={handleSubmit(onAddSubmit)}>
                    히스토리 생성하기
                  </BigSquareButton>

                  {allItemsDataStatus === 'success' && allItemsData.length === 0 && (
                    <S.NoDataMessage>데이터가 없습니다.</S.NoDataMessage>
                  )}

                  {allItemsDataStatus === 'pending' && <S.NoDataMessage>로딩중</S.NoDataMessage>}

                  {allItemsDataStatus === 'error' && (
                    <S.NoDataMessage>데이터를 불러오는데 실패했습니다.</S.NoDataMessage>
                  )}
                </div>
              </S.SectionCard>
            )}
          </S.SectionCardWrapper>
        </S.ContentContainer>
      </S.PageContainer>
    </>
  );
};

export default InventoryPriceHistoryPage;
