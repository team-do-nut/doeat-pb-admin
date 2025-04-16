import styled from '@emotion/styled';
import { CalendarDataStatus } from './FormInputDateCalendar';

export const Container = styled.div<{ $isActive: boolean; $isDisabled?: boolean }>`
  min-width: 123px;
  min-height: 48px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  column-gap: 4px;
  border: ${({ $isActive }) => ($isActive ? '1px solid #535353' : '1px solid #e3e3e3')};
  border-radius: 10px;
  background-color: ${({ $isDisabled }) => ($isDisabled ? '#f2f2f2' : '#ffffff')};
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
`;

export const DateInputText = styled.span<{ $isDisabled?: boolean; $isDefault?: boolean }>`
  margin-top: 2px;
  font-size: 13px;
  color: ${({ $isDisabled, $isDefault }) => {
    if ($isDisabled) return '#c8c8c8';
    if ($isDefault) return '#939393';
    return '#535353';
  }};
`;

export const CalendarContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: -13px;
  transform: translateY(100%);
  width: 387px;
  height: 359px;
  padding: 30px 26px 0px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 2px 23px 0 #ddd;
  z-index: 99999;
`;

export const CalendarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 4px;
  margin-bottom: 30px;
`;

export const CalendarCurrentDate = styled.span`
  font-size: 17px;
  font-weight: 500;
  line-height: 20px;
  color: #535353;
`;

export const CalendarIconButtonBox = styled.div`
  display: flex;
  column-gap: 12px;
`;

export const CalendarIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background-color: rgba(223, 223, 223, 0.4);
  border-radius: 11px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

export const CalendarTable = styled.div`
  width: 100%;
  font-size: 13px;
  font-weight: 500;
`;

export const CalendarTrWrapper = styled.div`
  position: relative;
`;

export const CalendarTr = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;

  div:first-child {
    color: #fa535f;
  }
  div:last-child {
    color: #368df5;
  }
`;

export const CalendarTd = styled.div<{ $status: CalendarDataStatus; $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#fee34c' : 'transparent')};

  cursor: ${({ $status }) => ($status === CalendarDataStatus.ThisMonth ? 'pointer' : 'auto')};
  z-index: 2;

  span {
    opacity: ${({ $status }) => {
      if ($status === CalendarDataStatus.ThisMonth) return 1;
      if ($status === CalendarDataStatus.NotThisMonth) return 0.4;
      return 0.2;
    }};
  }
`;

export const CalendarTh = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  margin-bottom: 12px;
  opacity: 0.65;
`;
