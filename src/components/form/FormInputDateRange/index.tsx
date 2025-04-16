import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import FormInputDateRangeCalendar from './FormInputDateRangeCalendar';
import * as S from './styles';

interface DateRangeValue {
  startDate: string;
  endDate: string;
}

export interface FormInputDateRangeProps {
  disabled?: boolean;
  min?: string;
  max?: string;
  value: DateRangeValue | undefined;
  onChange: (value: DateRangeValue) => void;
}

const FormInputDateRange: FC<FormInputDateRangeProps> = ({ min, max, value, onChange, disabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const calendarHandler = useCallback(() => {
    if (disabled) return;
    setIsCalendarOpen((prev) => !prev);
  }, [disabled]);

  const selectDateHandler = useCallback(
    (date: DateRangeValue) => {
      onChange(date);
      if (date.endDate) {
        calendarHandler();
      }
    },
    [calendarHandler, onChange],
  );

  const selectDateValue = useMemo(() => {
    if (!value) return 'yyyy.mm.dd ~ yyyy.mm.dd';
    return `${dayjs(value.startDate).format('YYYY.MM.DD')} ~ ${dayjs(
      value.endDate.length === 0 ? value.startDate : value.endDate,
    ).format('YYYY.MM.DD')}`;
  }, [value]);

  const eventHandler = useCallback(
    (e: MouseEvent) => {
      if (
        e.target &&
        containerRef &&
        !containerRef.current?.contains(e.target as Node) &&
        calendarRef &&
        !calendarRef.current?.contains(e.target as Node)
      ) {
        if (value && value.startDate && !value.endDate && isCalendarOpen) {
          onChange({ startDate: value.startDate, endDate: value.startDate });
        }
        setIsCalendarOpen(false);
      }
    },
    [isCalendarOpen, onChange, value],
  );

  useEffect(() => {
    document.addEventListener('mousedown', eventHandler);
    return () => {
      document.removeEventListener('mousedown', eventHandler);
    };
  }, [eventHandler]);

  return (
    <div style={{ position: 'relative', width: 'fit-content', height: 'fit-content' }}>
      <S.Container ref={containerRef} onClick={calendarHandler} isActive={isCalendarOpen} isDisalbed={disabled}>
        🗓️
        <S.DateInputText isDefault={!value} isDisabled={disabled}>
          {selectDateValue}
        </S.DateInputText>
      </S.Container>
      {isCalendarOpen && (
        <FormInputDateRangeCalendar
          ref={calendarRef}
          min={min ?? '0001-01-01'}
          max={max ?? '9999-12-31'}
          date={value}
          setDate={selectDateHandler}
        />
      )}
    </div>
  );
};

export default FormInputDateRange;
