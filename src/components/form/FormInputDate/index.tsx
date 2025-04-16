import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import FormInputDateCalendar from './FormInputDateCalendar';
import * as S from './styles';

export interface FormInputDateProps {
  disabled?: boolean;
  min?: string;
  max?: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const FormInputDate: FC<FormInputDateProps> = ({ value, disabled, onChange, min, max }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const calendarHandler = useCallback(() => {
    if (disabled) {
      return;
    }
    setIsCalendarOpen((prev) => !prev);
  }, [disabled]);

  const selectDateHandler = useCallback(
    (date: string) => {
      onChange(date);
      calendarHandler();
    },
    [calendarHandler, onChange],
  );

  const selectDateValue = useMemo(() => {
    if (!value) return 'yyyy.mm.dd';
    return dayjs(value).format('YYYY.MM.DD');
  }, [value]);

  const eventHandler = useCallback((e: MouseEvent) => {
    if (
      e.target &&
      containerRef &&
      !containerRef.current?.contains(e.target as Node) &&
      calendarRef &&
      !calendarRef.current?.contains(e.target as Node)
    ) {
      setIsCalendarOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', eventHandler);
    return () => {
      document.removeEventListener('mousedown', eventHandler);
    };
  }, [eventHandler]);

  return (
    <div style={{ position: 'relative', width: 'fit-content', height: 'fit-content' }}>
      <S.Container ref={containerRef} onClick={calendarHandler} $isActive={isCalendarOpen} $isDisabled={disabled}>
        🗓️
        <S.DateInputText $isDefault={!value} $isDisabled={disabled}>
          {selectDateValue}
        </S.DateInputText>
      </S.Container>
      {!disabled && isCalendarOpen && (
        <FormInputDateCalendar
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

export default FormInputDate;
