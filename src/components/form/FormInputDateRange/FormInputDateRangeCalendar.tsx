import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import * as S from './styles';

export enum FormInputDateRangeCalendarDataStatus {
  ThisMonth,
  NotThisMonth,
  Disabled,
}

interface CalendarRowData {
  day: number;
  value: string;
  status: FormInputDateRangeCalendarDataStatus;
}

interface CalendarRow {
  id: string;
  data: CalendarRowData[];
  firstDateValue: number;
  lastDateValue: number;
}
interface DateRangeValue {
  startDate: string;
  endDate: string;
}

export interface FormInputDateRangeCalendarProps {
  min: string;
  max: string;
  date?: DateRangeValue;
  setDate: (date: DateRangeValue) => void;
}

const FormInputDateRangeCalendar = forwardRef<HTMLDivElement, FormInputDateRangeCalendarProps>(
  ({ min, max, date, setDate }, ref) => {
    const [currentDate, setCurrentDate] = useState<string | undefined>(date?.startDate);

    const minDateClass = useRef(dayjs(min));

    const maxDateClass = useRef(dayjs(max));

    const currentDateClass = useMemo(() => dayjs(currentDate).startOf('month'), [currentDate]);

    // 데이터
    const calendarData: CalendarRow[] = useMemo(() => {
      const minDateTimestamp = minDateClass.current.valueOf();
      const maxDateTimestamp = maxDateClass.current.valueOf();
      const currentMonthLastDayTimestamp = currentDateClass.endOf('month').valueOf();
      const currentMonthFirstDayTimestamp = currentDateClass.valueOf();
      const dayOfWeek = currentDateClass.day();

      const handleStatus = (timestamp: number) => {
        if (timestamp < minDateTimestamp || timestamp > maxDateTimestamp)
          return FormInputDateRangeCalendarDataStatus.Disabled;
        if (timestamp < currentMonthFirstDayTimestamp || timestamp > currentMonthLastDayTimestamp)
          return FormInputDateRangeCalendarDataStatus.NotThisMonth;
        return FormInputDateRangeCalendarDataStatus.ThisMonth;
      };

      const firstRow: CalendarRowData[] = Array.from({ length: 7 }, (_, i) => {
        if (i < dayOfWeek) {
          const dateClass = currentDateClass.subtract(dayOfWeek - i, 'd');
          return {
            day: dateClass.date(),
            value: dateClass.format('YYYY-MM-DD'),
            status: handleStatus(dateClass.valueOf()),
          };
        }
        const dateClass = currentDateClass.add(i - dayOfWeek, 'd');
        return {
          day: dateClass.date(),
          value: dateClass.format('YYYY-MM-DD'),
          status: handleStatus(dateClass.valueOf()),
        };
      });

      const restRow: CalendarRow[] = Array.from({ length: 5 }, (_, i) => {
        const firstDateClass = currentDateClass.add(7 * (i + 1), 'day').startOf('week');
        const firstDateValue = firstDateClass.valueOf();
        const lastDateValue = firstDateClass.endOf('week').startOf('date').valueOf();
        const data: CalendarRowData[] = Array.from({ length: 7 }, (__, j) => {
          const dateClass = firstDateClass.add(j, 'day');
          const dateClassDay = dateClass.date();
          return {
            day: dateClassDay,
            value: dateClass.format('YYYY-MM-DD'),
            status: handleStatus(dateClass.valueOf()),
          };
        });

        return { id: `Row${i + 1}`, data, firstDateValue, lastDateValue };
      });

      return [
        {
          id: 'Row0',
          data: firstRow,
          firstDateValue: currentDateClass.startOf('week').valueOf(),
          lastDateValue: currentDateClass.endOf('week').startOf('date').valueOf(),
        },
        ...restRow,
      ];
    }, [currentDateClass]);

    // 과거 달

    const isPrevButtonDisabled = useMemo(
      () =>
        currentDateClass.month() === minDateClass.current.month() &&
        currentDateClass.year() === minDateClass.current.year(),
      [currentDateClass],
    );

    const onPrevMonthClick = useCallback(() => {
      const prevMonth = currentDateClass.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
      setCurrentDate(prevMonth);
    }, [currentDateClass]);

    // 미래 달

    const isNextButtonDisabled = useMemo(
      () =>
        currentDateClass.month() === maxDateClass.current.month() &&
        currentDateClass.year() === maxDateClass.current.year(),
      [currentDateClass],
    );

    const onNextMonthClick = useCallback(() => {
      const nextMonth = currentDateClass.add(1, 'month').startOf('month').format('YYYY-MM-DD');
      setCurrentDate(nextMonth);
    }, [currentDateClass]);

    // 하이라이트
    const getTrHighlightProps = useCallback(
      (firstDateValue: number, lastDateValue: number) => {
        const startDateClass = dayjs(date?.startDate);
        const endDateClass = dayjs(date?.endDate);
        const firstDateClass = dayjs(firstDateValue);
        const lastDateClass = dayjs(lastDateValue);
        const startDateValue = startDateClass.valueOf();
        const endDateValue = endDateClass.valueOf();

        if (startDateValue < firstDateValue && endDateValue > lastDateValue) {
          return { w: '100%', left: '0px' };
        }

        if (startDateValue)
          if (startDateValue < firstDateValue && endDateValue <= lastDateValue && endDateValue > firstDateValue) {
            const width = (125 / 6 + 30) * (endDateClass.day() - firstDateClass.day()) + 15;
            return { w: `${width}px`, left: '0px' };
          }

        if (startDateValue >= firstDateValue && startDateValue < lastDateValue && endDateValue > lastDateValue) {
          const width = (125 / 6 + 30) * (lastDateClass.day() - startDateClass.day()) + 15;
          return { w: `${width}px`, right: '0px' };
        }

        if (
          startDateValue >= firstDateValue &&
          startDateValue <= lastDateValue &&
          endDateValue >= firstDateValue &&
          endDateValue <= lastDateValue
        ) {
          const width = (125 / 6 + 30) * (endDateClass.day() - startDateClass.day());
          const left = (125 / 6 + 30) * (startDateClass.day() - firstDateClass.day()) + 15;
          return { w: `${width}px`, left: `${left}px` };
        }

        return { w: '0px', left: '0px' };
      },
      [date],
    );

    // 달 클릭

    const onDateClick = useCallback(
      (dateValue: string, status: FormInputDateRangeCalendarDataStatus) => {
        if (status !== FormInputDateRangeCalendarDataStatus.ThisMonth) return;

        const startDateClass = dayjs(date?.startDate);
        const startDateValue = startDateClass.valueOf();

        const dateValueClass = dayjs(dateValue);
        const dateValueValue = dateValueClass.valueOf();

        if (!date) {
          setDate({ startDate: dateValueClass.format('YYYY-MM-DD'), endDate: '' });
        }

        if (date && date.startDate && date.endDate) {
          setDate({ startDate: dateValueClass.format('YYYY-MM-DD'), endDate: '' });
        }

        if (date && date.startDate && !date.endDate) {
          if (startDateValue > dateValueValue) {
            setDate({ startDate: dateValueClass.format('YYYY-MM-DD'), endDate: date.endDate });
          } else {
            setDate({ endDate: dateValueClass.format('YYYY-MM-DD'), startDate: date.startDate });
          }
        }
      },
      [date, setDate],
    );

    return (
      <S.CalendarContainer ref={ref}>
        <S.CalendarTop>
          <S.CalendarCurrentDate>{currentDateClass.format('YYYY.MM')}</S.CalendarCurrentDate>
          <S.CalendarIconButtonBox>
            <S.CalendarIconButton onClick={onPrevMonthClick} disabled={isPrevButtonDisabled}>
              &lt;
            </S.CalendarIconButton>
            <S.CalendarIconButton onClick={onNextMonthClick} disabled={isNextButtonDisabled}>
              &gt;
            </S.CalendarIconButton>
          </S.CalendarIconButtonBox>
        </S.CalendarTop>
        <S.CalendarTable>
          <S.CalendarTr>
            <S.CalendarTh>일</S.CalendarTh>
            <S.CalendarTh>월</S.CalendarTh>
            <S.CalendarTh>화</S.CalendarTh>
            <S.CalendarTh>수</S.CalendarTh>
            <S.CalendarTh>목</S.CalendarTh>
            <S.CalendarTh>금</S.CalendarTh>
            <S.CalendarTh>토</S.CalendarTh>
          </S.CalendarTr>
          {calendarData.map((row) => (
            <S.CalendarTrWrapper key={row.id}>
              <S.CalendarTrHighlight {...getTrHighlightProps(row.firstDateValue, row.lastDateValue)} />
              <S.CalendarTr>
                {row.data.map((data) => (
                  <S.CalendarTd
                    key={data.value}
                    status={data.status}
                    isSelected={data.value === date?.startDate || data.value === date?.endDate}
                    onClick={() => onDateClick(data.value, data.status)}
                  >
                    <span>{data.day}</span>
                  </S.CalendarTd>
                ))}
              </S.CalendarTr>
            </S.CalendarTrWrapper>
          ))}
        </S.CalendarTable>
      </S.CalendarContainer>
    );
  },
);

export default FormInputDateRangeCalendar;
