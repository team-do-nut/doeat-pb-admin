import Head from 'next/head';

import Navigation from '@src/components/Navigation';
import BigSquareButton from '@src/components/button/BigSquareButton';
import FormInputDateRange from '@src/components/form/FormInputDateRange';
import FormInputText from '@src/components/form/FormInputText';

import InventoryNavigation from '../_components/InventoryNavigation';
import useInventoryPriceHistoryPageController from '../_hooks/useInventoryPriceHistoryPageController';
import S from '../_styles';

const InventoryPriceHistoryPage = () => {
  const {
    startDate,
    endDate,
    register,
    getValues,
    historyDataFields,

    allItemsQuery,
    itemPriceHistoryQuery,

    onDateRangeChange,
    onUpsertClick,
  } = useInventoryPriceHistoryPageController();

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
                {itemPriceHistoryQuery.status === 'success' &&
                  allItemsQuery.status === 'success' &&
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

                {itemPriceHistoryQuery.status === 'success' &&
                  allItemsQuery.status === 'success' &&
                  historyDataFields.length === 0 && <S.NoDataMessage>데이터가 존재하지 않습니다.</S.NoDataMessage>}

                {(itemPriceHistoryQuery.status === 'pending' || allItemsQuery.status === 'pending') && (
                  <S.NoDataMessage>로딩중</S.NoDataMessage>
                )}

                {(itemPriceHistoryQuery.status === 'error' || allItemsQuery.status === 'error') && (
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
