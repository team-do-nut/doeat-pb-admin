import Head from 'next/head';
import { Controller } from 'react-hook-form';

import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import SmallSquareButton from '@src/components/button/SmallSquareButton';
import FormInputSelect from '@src/components/form/FormInputSelect';
import FormInputText from '@src/components/form/FormInputText';

import InventoryNavigation from '../_components/InventoryNavigation';
import { INVENTORY_ITEM_TYPE_SELECT_OPTIONS, INVENTORY_TAX_TYPE_SELECT_OPTIONS } from '../_core/options';
import useInventoryItemPageController from '../_hooks/useInventoryItemPageController';
import S from '../_styles';
import { getInventoryItemTypeLabel, getInventoryTaxTypeLabel } from '../_utils/parse';

const InventoryItemPage = () => {
  const {
    register,
    control,
    handleSubmit,
    itemDataFields,

    allItemsQuery,

    onItemAppendClick,
    onItemRemoveClick,
    onItemSubmit,
  } = useInventoryItemPageController();

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
                    {allItemsQuery.status === 'success' && allItemsQuery.data.length > 0 && (
                      <S.TableBody>
                        {allItemsQuery.data.map(({ id, name, taxType, type, unit }) => (
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

                {allItemsQuery.status === 'success' && allItemsQuery.data.length === 0 && (
                  <S.NoDataMessage>재료 데이터가 없습니다.</S.NoDataMessage>
                )}

                {allItemsQuery.status === 'pending' && <S.NoDataMessage>로딩중</S.NoDataMessage>}

                {allItemsQuery.status === 'error' && (
                  <S.NoDataMessage>데이터를 불러오는데 실패했습니다.</S.NoDataMessage>
                )}
              </div>
            </S.SectionCard>
          </S.SectionCardWrapper>
        </S.ContentContainer>
      </S.PageContainer>
    </>
  );
};

export default InventoryItemPage;
