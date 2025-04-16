import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as S from './styles';

interface Option {
  value: string;
  label: string;
}

interface FormInputSelectProps {
  label?: string;
  errorMessage?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FormInputSelect: FC<FormInputSelectProps> = ({
  label,
  errorMessage,
  options,
  value,
  onChange,
  placeholder = '선택하세요',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelectOption = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);

  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <S.InputContainer>
      <S.ContentWrapper ref={containerRef}>
        {label && <S.LabelText>{label}</S.LabelText>}
        <S.SelectContainer isOpen={isOpen} onClick={handleToggleDropdown}>
          <S.SelectText isSelected={!!selectedOption}>{displayText}</S.SelectText>
          <S.CaretIcon isOpen={isOpen} />
        </S.SelectContainer>

        {isOpen && (
          <S.DropdownList>
            {options.map((option) => (
              <S.DropdownItem
                key={option.value}
                isSelected={option.value === value}
                onClick={() => handleSelectOption(option.value)}
              >
                {option.label}
                {option.value === value && <S.CheckMark />}
              </S.DropdownItem>
            ))}
          </S.DropdownList>
        )}

        {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
      </S.ContentWrapper>
    </S.InputContainer>
  );
};

export default FormInputSelect;
