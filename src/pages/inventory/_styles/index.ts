import styled from '@emotion/styled';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const ContentContainer = styled.div`
  padding: 24px;
`;

const SectionBox = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  padding: 0 24px;
  margin: 0 auto;
`;

const SectionCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const SectionCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 24px 0;
`;

const FilterSection = styled.section`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-end;
`;

const FilterInputContainer = styled.div`
  width: 200px;
`;

const FilterTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableSection = styled.section`
  padding: 24px;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px; // 표가 길어질 경우 최소 너비 설정
`;

const TableHeader = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
  position: sticky;
  top: 0;
  background-color: #f9fafb;
  z-index: 1;
`;

const TableBody = styled.tbody`
  & tr:nth-of-type(even) {
    background-color: #f9fafb;
  }

  & tr.hoverable:hover {
    background-color: #f3f4f6;
    cursor: pointer;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: #111827;
  white-space: nowrap;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #374151;
  }

  &.edit {
    background-color: #111827;

    &:hover {
      background-color: #374151;
    }
  }

  &.delete {
    background-color: #111827;

    &:hover {
      background-color: #374151;
    }
  }

  &.save {
    background-color: #111827;

    &:hover {
      background-color: #374151;
    }
  }

  &.cancel {
    background-color: #e5e7eb;
    color: #111827;

    &:hover {
      background-color: #d1d5db;
    }
  }
`;

const DateLabel = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #4b5563;
  margin: 24px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;

  &:first-of-type {
    margin-top: 0;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 32px;
  color: #6b7280;
  font-style: italic;
  font-size: 14px;
`;

const SearchButton = styled.button`
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #374151;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const LoadingBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const BigSquareButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
`;

const RowTableBox = styled.div`
  display: flex;
  overflow: scroll;
  column-gap: 12px;
`;

const RowTableWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const HorizontalScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 16px;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px 0;
`;

const ItemCard = styled.div`
  min-width: 320px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  background-color: white;
`;

const CardHeader = styled.div`
  background-color: #f9fafb;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const CardRow = styled.div`
  display: flex;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CardLabel = styled.div`
  width: 100px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  padding-top: 8px;
`;

const CardValue = styled.div`
  flex: 1;
`;

const DateHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaeaea;
`;

const InventoryComponents = {
  PageContainer,
  ContentContainer,
  SectionBox,
  SectionCardWrapper,
  SectionCard,
  PageTitle,
  FilterSection,
  FilterContainer,
  FilterInputContainer,
  FilterTitle,
  TableSection,
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  ActionButtonsContainer,
  ActionButton,
  DateLabel,
  NoDataMessage,
  SearchButton,
  PaginationWrapper,
  LoadingBox,
  BigSquareButtonWrapper,
  RowTableBox,
  RowTableWrapper,
  HorizontalScrollContainer,
  CardsContainer,
  ItemCard,
  CardHeader,
  CardTitle,
  CardBody,
  CardRow,
  CardLabel,
  CardValue,
  DateHeader,
};

export default InventoryComponents;
