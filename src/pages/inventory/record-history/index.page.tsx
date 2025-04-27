import Head from 'next/head';

import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import FormInputDateRange from '@src/components/form/FormInputDateRange';
import FormInputSelect from '@src/components/form/FormInputSelect';
import FormInputText from '@src/components/form/FormInputText';

import InventoryNavigation from '../_components/InventoryNavigation';
import { INVENTORY_TYPE_SELECT_OPTIONS } from '../_core/options';
import useInventoryRecordHistoryPageController from '../_hooks/useInventoryRecordHistoryPageController';
import S from '../_styles';
import { getInventoryItemLabel } from '../_utils/parse';

const InventoryRecordHistoryPage = () => {
  const {
    startDate,
    endDate,
    inventoryType,
    register,
    getValues,
    newDataFields,

    allItemsQuery,
    inventoryRecordsQuery,

    onDateRangeChange,
    onInventoryTypeChange,
    onUpsertClick,
  } = useInventoryRecordHistoryPageController();

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
                <S.FilterWrapper>
                  <b>기간 선택</b>
                  <FormInputDateRange value={{ startDate, endDate }} onChange={onDateRangeChange} />
                </S.FilterWrapper>
                <S.FilterWrapper>
                  <b>타입 선택</b>
                  <div style={{ width: '208px' }}>
                    <FormInputSelect
                      options={[{ value: '', label: '전체보기' }, ...INVENTORY_TYPE_SELECT_OPTIONS]}
                      value={inventoryType}
                      onChange={onInventoryTypeChange}
                    />
                  </div>
                </S.FilterWrapper>
              </S.FilterInputContainer>
            </S.FilterContainer>

            <div>
              {inventoryRecordsQuery.status === 'success' &&
                allItemsQuery.status === 'success' &&
                newDataFields.length > 0 &&
                newDataFields.map((dateGroup, dateIndex) => {
                  const dateItems = getValues(`newData.${dateIndex}`);
                  const dateItem = dateItems[0];

                  return (
                    <div key={dateGroup.id}>
                      <S.DateHeader>{dateItem.date} 재고 현황</S.DateHeader>
                      <S.TableContainer>
                        <S.Table>
                          <colgroup>
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
                              <S.TableHeaderCell>날짜</S.TableHeaderCell>
                              <S.TableHeaderCell>타입</S.TableHeaderCell>
                              <S.TableHeaderCell>단위</S.TableHeaderCell>
                              <S.TableHeaderCell>양</S.TableHeaderCell>
                            </tr>
                          </S.TableHeader>
                          <S.TableBody>
                            {dateItems.map((item, itemIndex) => (
                              <S.TableRow key={`${item.itemId}-${item.date}-${item.inventoryType}`}>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.itemId} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.itemName} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.date} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText
                                    readOnly
                                    defaultValue={
                                      item.inventoryType === '' ? '' : getInventoryItemLabel(item.inventoryType)
                                    }
                                  />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText readOnly defaultValue={item.unit} />
                                </S.TableCell>
                                <S.TableCell>
                                  <FormInputText {...register(`newData.${dateIndex}.${itemIndex}.quantity`)} />
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

              {inventoryRecordsQuery.status === 'success' &&
                allItemsQuery.status === 'success' &&
                newDataFields.length === 0 && <S.NoDataMessage>데이터가 존재하지 않습니다.</S.NoDataMessage>}

              {(inventoryRecordsQuery.status === 'pending' || allItemsQuery.status === 'pending') && (
                <S.NoDataMessage>로딩중</S.NoDataMessage>
              )}
              {(inventoryRecordsQuery.status === 'error' || allItemsQuery.status === 'error') && (
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
