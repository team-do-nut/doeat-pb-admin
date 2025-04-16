import { useCallback } from 'react';
import Head from 'next/head';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import PbInventoryApi from '@src/api/pb/inventory/PbInventory';
import { PbItemTaxType, PbItemType, PostInventoryItemRequest } from '@src/api/pb/inventory/PbInventory.types';
import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import SmallSquareButton from '@src/components/button/SmallSquareButton';
import FormInputSelect from '@src/components/form/FormInputSelect';
import FormInputText from '@src/components/form/FormInputText';

import { isValidEmpty } from '@src/utils/valid';
import InventoryNavigation from '../_components/InventoryNavigation';
import { INVENTORY_ITEM_TYPE_SELECT_OPTIONS, INVENTORY_TAX_TYPE_SELECT_OPTIONS } from '../_core/options';
import S from '../_styles';
import { getInventoryItemTypeLabel, getInventoryTaxTypeLabel } from '../_utils/parse';

interface InventoryItemFormFields {
  itemData: {
    name: string;
    unit: string;
    type: PbItemType | '';
    taxType: PbItemTaxType | '';
  }[];
}

const InventoryItemPage = () => {
  const { register, control, handleSubmit } = useForm<InventoryItemFormFields>({
    defaultValues: {
      itemData: [
        {
          name: '',
          unit: '',
          type: '',
          taxType: '',
        },
      ],
    },
  });

  const {
    fields: itemDataFields,
    append: appendItemData,
    remove: removeItemData,
  } = useFieldArray({ control, name: 'itemData' });

  const queryClient = useQueryClient();

  const { data: allItemsData, status: allItemsDataStatus } = useQuery({
    queryKey: [PbInventoryApi.getAllItemsApiKey],
    queryFn: () => PbInventoryApi.getAllItems(),
  });

  const { mutate: postItem } = useMutation({
    mutationFn: PbInventoryApi.postItem,
    onSuccess: async () => {
      alert('재료 품목 생성 완료!');
      await queryClient.invalidateQueries({ queryKey: [PbInventoryApi.getAllItemsApiKey] });
    },
    onError: () => {
      alert('재료 품목 생성하는데 실패했습니다.');
    },
  });

  /* 단가_생성 */
  const onItemAppendClick = useCallback(() => {
    appendItemData({ name: '', taxType: '', type: '', unit: '' });
  }, [appendItemData]);

  const onItemRemoveClick = useCallback(
    (index: number) => () => {
      if (itemDataFields.length <= 1) return;
      removeItemData(index);
    },
    [itemDataFields, removeItemData],
  );

  const onItemSubmit = useCallback<SubmitHandler<InventoryItemFormFields>>(
    ({ itemData }) => {
      if (itemData.some(({ name, taxType, type, unit }) => !isValidEmpty([name, taxType, type, unit]))) {
        alert('입력을 전부 채워주세요');
        return;
      }

      const transformedData: PostInventoryItemRequest[] = itemData.map(({ name, taxType, type, unit }) => ({
        name,
        taxType: taxType as PbItemTaxType,
        type: type as PbItemType,
        unit,
      }));

      postItem(transformedData);
    },
    [postItem],
  );

  return (
    <>
      <Head>
        <title>PB | 재료 관리</title>
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
              <S.PageTitle>재료 품목 생성</S.PageTitle>

              <div style={{ marginBottom: '40px' }}>
                <S.TableContainer>
                  <S.Table>
                    <colgroup>
                      <col width="10%" />
                      <col width="10%" />
                      <col width="10%" />
                      <col width="10%" />
                      <col width="10%" />
                    </colgroup>
                    <S.TableHeader>
                      <tr>
                        <S.TableHeaderCell>이름</S.TableHeaderCell>
                        <S.TableHeaderCell>단위</S.TableHeaderCell>
                        <S.TableHeaderCell>타입</S.TableHeaderCell>
                        <S.TableHeaderCell>세금타입</S.TableHeaderCell>
                        <S.TableHeaderCell>행</S.TableHeaderCell>
                      </tr>
                    </S.TableHeader>

                    <S.TableBody>
                      {itemDataFields.map(({ id }, index) => (
                        <S.TableRow key={id}>
                          <S.TableCell>
                            <FormInputText {...register(`itemData.${index}.name`)} />
                          </S.TableCell>
                          <S.TableCell>
                            <FormInputText {...register(`itemData.${index}.unit`)} />
                          </S.TableCell>
                          <S.TableCell>
                            <Controller
                              control={control}
                              name={`itemData.${index}.type`}
                              render={({ field: { value, onChange } }) => (
                                <FormInputSelect
                                  options={INVENTORY_ITEM_TYPE_SELECT_OPTIONS}
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </S.TableCell>
                          <S.TableCell>
                            <Controller
                              control={control}
                              name={`itemData.${index}.taxType`}
                              render={({ field: { value, onChange } }) => (
                                <FormInputSelect
                                  options={INVENTORY_TAX_TYPE_SELECT_OPTIONS}
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </S.TableCell>
                          <S.TableCell style={{ display: 'flex', justifyContent: 'center' }}>
                            <SmallSquareButton variant="delete" onClick={onItemRemoveClick(index)}>
                              삭제
                            </SmallSquareButton>
                          </S.TableCell>
                        </S.TableRow>
                      ))}
                    </S.TableBody>
                  </S.Table>
                </S.TableContainer>

                <S.BigSquareButtonWrapper>
                  <BigSquareButton style={{ width: '100%' }} variant="outline" onClick={onItemAppendClick}>
                    행 추가하기
                  </BigSquareButton>
                  <BigSquareButton style={{ width: '100%' }} variant="primary" onClick={handleSubmit(onItemSubmit)}>
                    재료 품목 생성하기
                  </BigSquareButton>
                </S.BigSquareButtonWrapper>
              </div>

              <S.PageTitle>현재 재료 품목</S.PageTitle>

              <div>
                <S.TableContainer>
                  <S.Table>
                    <S.TableHeader>
                      <tr>
                        <S.TableHeaderCell>ID</S.TableHeaderCell>
                        <S.TableHeaderCell>이름</S.TableHeaderCell>
                        <S.TableHeaderCell>단위</S.TableHeaderCell>
                        <S.TableHeaderCell>타입</S.TableHeaderCell>
                        <S.TableHeaderCell>세금타입</S.TableHeaderCell>
                      </tr>
                    </S.TableHeader>
                    {allItemsDataStatus === 'success' && allItemsData.length > 0 && (
                      <S.TableBody>
                        {allItemsData.map(({ id, name, taxType, type, unit }) => (
                          <S.TableRow key={id}>
                            <S.TableCell>
                              <FormInputText readOnly defaultValue={id} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly defaultValue={name} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly defaultValue={unit} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly defaultValue={getInventoryItemTypeLabel(type)} />
                            </S.TableCell>
                            <S.TableCell>
                              <FormInputText readOnly defaultValue={getInventoryTaxTypeLabel(taxType)} />
                            </S.TableCell>
                          </S.TableRow>
                        ))}
                      </S.TableBody>
                    )}
                  </S.Table>
                </S.TableContainer>

                {allItemsDataStatus === 'success' && allItemsData.length === 0 && (
                  <S.NoDataMessage>재료 데이터가 없습니다.</S.NoDataMessage>
                )}

                {allItemsDataStatus === 'pending' && <S.NoDataMessage>로딩중</S.NoDataMessage>}

                {allItemsDataStatus === 'error' && <S.NoDataMessage>데이터를 불러오는데 실패했습니다.</S.NoDataMessage>}
              </div>
            </S.SectionCard>
          </S.SectionCardWrapper>
        </S.ContentContainer>
      </S.PageContainer>
    </>
  );
};

export default InventoryItemPage;
