import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import PbInventoryApi from '@src/api/pb/inventory/PbInventory';
import type {
  InventoryType,
  PbItemTaxType,
  PbItemType,
  PostInventoryRecordRequest,
} from '@src/api/pb/inventory/PbInventory.types';
import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import SmallSquareButton from '@src/components/button/SmallSquareButton';
import FormInputDate from '@src/components/form/FormInputDate';
import FormInputDateRange from '@src/components/form/FormInputDateRange';
import FormInputSelect from '@src/components/form/FormInputSelect';
import FormInputText from '@src/components/form/FormInputText';

import InventoryNavigation from '../_components/InventoryNavigation';
import InventoryTab from '../_components/InventoryTab';
import {
  INVENTORY_TAB_ITEMS,
  INVENTORY_TAX_TYPE_SELECT_OPTIONS,
  INVENTORY_TYPE_SELECT_OPTIONS,
} from '../_core/options';
import S from '../_styles';

interface InventoryRecordHistoryFormFields {
  originalData: {
    id: number;
    itemId: number;
    itemName: string;
    unit: string;
    date: string;
    createdAt: string;
    lastModifiedAt: string;
    quantity: string;
    inventoryType: InventoryType;
  }[][];
  newData: {
    itemId: number;
    itemName: string;
    unit: string;
    date: string;
    quantity: string;
    taxType: PbItemTaxType;
    itemType: PbItemType;
    inventoryType: InventoryType;
  }[];
}

const InventoryRecordHistoryPage = () => {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { register, control, handleSubmit, setValue, getValues } = useForm<InventoryRecordHistoryFormFields>({
    defaultValues: {
      originalData: [],
      newData: [],
    },
  });

  const { fields: newDataFields } = useFieldArray({ control, name: 'newData' });
  const { fields: originalDataFields } = useFieldArray({ control, name: 'originalData' });

  const queryClient = useQueryClient();

  const { data: inventoryRecordsData, status: inventoryRecordsDataStatus } = useQuery({
    queryKey: [PbInventoryApi.getInventoryRecordsApiKey, { start: startDate, end: endDate }] as const,
    queryFn: ({ queryKey: [, { start, end }] }) => PbInventoryApi.getInventoryRecords({ start, end }),
    enabled: !!startDate && !!endDate,
  });

  const groupedByDate = useMemo(() => {
    if (!inventoryRecordsData) return null;

    return inventoryRecordsData.reduce<Record<string, InventoryRecordHistoryFormFields['originalData'][0]>>(
      (acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }

        acc[item.date].push({
          id: item.id,
          itemId: item.itemId,
          unit: item.unit,
          date: item.date,
          createdAt: item.createdAt,
          lastModifiedAt: item.lastModifiedAt,
          quantity: item.quantity.toString(),
          inventoryType: item.type,
          itemName: item.itemName,
        });

        return acc;
      },
      {},
    );
  }, [inventoryRecordsData]);

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

  const { mutate: putInventoryRecord } = useMutation({
    mutationFn: PbInventoryApi.putInventoryRecord,
    onSuccess: onMutateSuccess,
    onError: onMutateError,
  });

  const onTabChange = useCallback((value: number) => {
    setActiveIndex(value);
  }, []);

  const onDateRangeChange = useCallback(({ startDate, endDate }: { startDate: string; endDate: string }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, []);

  const onDateChange = useCallback((value: string) => {
    setDate(value);
  }, []);

  const onUpdateClick = useCallback(
    ({ dateIndex, itemIndex }: { dateIndex: number; itemIndex: number }) =>
      () => {
        const { date, id, inventoryType, itemId, quantity } = getValues(`originalData.${dateIndex}.${itemIndex}`);
        putInventoryRecord({ id, date, itemId, quantity: Number(quantity), type: inventoryType });
      },
    [getValues, putInventoryRecord],
  );

  const onAddSubmit = useCallback<SubmitHandler<InventoryRecordHistoryFormFields>>(
    ({ newData }) => {
      const transformedData: PostInventoryRecordRequest[] = newData.map(
        ({ date, itemId, quantity, inventoryType }) => ({
          date,
          itemId,
          quantity: Number(quantity),
          type: inventoryType,
        }),
      );

      postInventoryRecords(transformedData);
    },
    [postInventoryRecords],
  );

  useEffect(() => {
    if (!groupedByDate) return;

    const sortedDates = Object.keys(groupedByDate)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => groupedByDate[date]);

    setValue('originalData', sortedDates);
  }, [groupedByDate, setValue]);

  useEffect(() => {
    if (allItemsData) {
      const transformedData: InventoryRecordHistoryFormFields['newData'] = allItemsData.map(
        ({ id, name, taxType, type, unit }) => ({
          itemId: id,
          unit,
          itemName: name,
          itemType: type,
          taxType,
          // 받아야 하는 것
          quantity: '0',
          date,
          inventoryType: 'INCOME',
        }),
      );

      setValue('newData', transformedData);
    }
  }, [allItemsData, date, setValue]);

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
        <InventoryTab items={INVENTORY_TAB_ITEMS} activeTab={activeIndex} onTabChange={onTabChange} />

        <S.ContentContainer>
          {activeIndex === 0 && (
            <S.SectionCard>
              <S.PageTitle>재고 현황</S.PageTitle>

              <S.FilterContainer>
                <S.FilterInputContainer>
                  <FormInputDateRange value={{ startDate, endDate }} onChange={onDateRangeChange} />
                </S.FilterInputContainer>
              </S.FilterContainer>

              <div>
                {inventoryRecordsDataStatus === 'success' &&
                  originalDataFields.length > 0 &&
                  originalDataFields.map((dateGroup, dateIndex) => {
                    const dateItems = getValues(`originalData.${dateIndex}`);
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
                              <col width="10%" />
                            </colgroup>
                            <S.TableHeader>
                              <tr>
                                <S.TableHeaderCell>ID</S.TableHeaderCell>
                                <S.TableHeaderCell>아이템 ID</S.TableHeaderCell>
                                <S.TableHeaderCell>이름</S.TableHeaderCell>
                                <S.TableHeaderCell>단위</S.TableHeaderCell>
                                <S.TableHeaderCell>생성일</S.TableHeaderCell>
                                <S.TableHeaderCell>수정일</S.TableHeaderCell>
                                <S.TableHeaderCell>양</S.TableHeaderCell>
                                <S.TableHeaderCell>타입</S.TableHeaderCell>
                                <S.TableHeaderCell>액션</S.TableHeaderCell>
                              </tr>
                            </S.TableHeader>
                            <S.TableBody>
                              {dateItems.map((itemField, itemIndex) => (
                                <S.TableRow key={itemField.id}>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`originalData.${dateIndex}.${itemIndex}.id`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`originalData.${dateIndex}.${itemIndex}.itemId`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`originalData.${dateIndex}.${itemIndex}.itemName`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      {...register(`originalData.${dateIndex}.${itemIndex}.unit`)}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      value={dayjs(
                                        getValues(`originalData.${dateIndex}.${itemIndex}.createdAt`),
                                      ).format('YYYY-MM-DD HH:mm')}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText
                                      readOnly
                                      value={dayjs(
                                        getValues(`originalData.${dateIndex}.${itemIndex}.lastModifiedAt`),
                                      ).format('YYYY-MM-DD HH:mm')}
                                    />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <FormInputText {...register(`originalData.${dateIndex}.${itemIndex}.quantity`)} />
                                  </S.TableCell>
                                  <S.TableCell>
                                    <Controller
                                      control={control}
                                      name={`originalData.${dateIndex}.${itemIndex}.inventoryType`}
                                      render={({ field: { value, onChange } }) => (
                                        <FormInputSelect
                                          options={INVENTORY_TYPE_SELECT_OPTIONS}
                                          value={value}
                                          onChange={onChange}
                                        />
                                      )}
                                    />
                                  </S.TableCell>
                                  <S.TableCell style={{ display: 'flex', justifyContent: 'center' }}>
                                    <SmallSquareButton variant="save" onClick={onUpdateClick({ dateIndex, itemIndex })}>
                                      수정
                                    </SmallSquareButton>
                                  </S.TableCell>
                                </S.TableRow>
                              ))}
                            </S.TableBody>
                          </S.Table>
                        </S.TableContainer>
                      </div>
                    );
                  })}

                {inventoryRecordsDataStatus === 'success' && originalDataFields.length === 0 && (
                  <S.NoDataMessage>선택한 기간 재고 히스토리 데이터가 없습니다.</S.NoDataMessage>
                )}
                {inventoryRecordsDataStatus === 'pending' && <S.NoDataMessage>로딩중</S.NoDataMessage>}
                {inventoryRecordsDataStatus === 'error' && (
                  <S.NoDataMessage>데이터를 불러오는데 실패했습니다.</S.NoDataMessage>
                )}
              </div>
            </S.SectionCard>
          )}

          {activeIndex === 1 && (
            <S.SectionCard>
              <S.PageTitle>재고 추가</S.PageTitle>

              <S.FilterContainer>
                <S.FilterInputContainer>
                  <FormInputDate value={date} onChange={onDateChange} />
                </S.FilterInputContainer>
              </S.FilterContainer>

              <div>
                <S.TableContainer>
                  <S.Table>
                    <colgroup>
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '10%' }} />
                    </colgroup>
                    <S.TableHeader>
                      <tr>
                        <S.TableHeaderCell>아이템 ID</S.TableHeaderCell>
                        <S.TableHeaderCell>이름</S.TableHeaderCell>
                        <S.TableHeaderCell>날짜</S.TableHeaderCell>
                        <S.TableHeaderCell>아이템타입</S.TableHeaderCell>
                        <S.TableHeaderCell>단위</S.TableHeaderCell>
                        <S.TableHeaderCell>양</S.TableHeaderCell>
                        <S.TableHeaderCell>세금타입</S.TableHeaderCell>

                        <S.TableHeaderCell>타입</S.TableHeaderCell>
                      </tr>
                    </S.TableHeader>
                    {allItemsDataStatus === 'success' && newDataFields.length > 0 && (
                      <S.TableBody>
                        {newDataFields.map(({ id }, index) => (
                          <S.TableRow key={id}>
                            <S.TableCell>
                              <FormInputText readOnly {...register(`newData.${index}.itemId`)} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly {...register(`newData.${index}.itemName`)} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly {...register(`newData.${index}.date`)} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly {...register(`newData.${index}.itemType`)} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly {...register(`newData.${index}.unit`)} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText {...register(`newData.${index}.quantity`)} />
                            </S.TableCell>
                            <S.TableCell>
                              <Controller
                                control={control}
                                name={`newData.${index}.taxType`}
                                render={({ field: { value, onChange } }) => (
                                  <FormInputSelect
                                    options={INVENTORY_TAX_TYPE_SELECT_OPTIONS}
                                    value={value}
                                    onChange={onChange}
                                  />
                                )}
                              />
                            </S.TableCell>

                            <S.TableCell>
                              <Controller
                                control={control}
                                name={`newData.${index}.inventoryType`}
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
                    )}
                  </S.Table>
                </S.TableContainer>

                {allItemsDataStatus === 'success' && allItemsData.length === 0 && (
                  <S.NoDataMessage>데이터가 없습니다.</S.NoDataMessage>
                )}

                <BigSquareButton style={{ width: '100%' }} variant="primary" onClick={handleSubmit(onAddSubmit)}>
                  저장
                </BigSquareButton>

                {allItemsDataStatus === 'pending' && <S.NoDataMessage>로딩중</S.NoDataMessage>}
                {allItemsDataStatus === 'error' && <S.NoDataMessage>데이터를 불러오는데 실패했습니다.</S.NoDataMessage>}
              </div>
            </S.SectionCard>
          )}
        </S.ContentContainer>
      </S.PageContainer>
    </>
  );
};

export default InventoryRecordHistoryPage;
