import { forwardRef, InputHTMLAttributes } from 'react';
import * as S from './styles';

interface FormInputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

const FormInputText = forwardRef<HTMLInputElement, FormInputTextProps>(({ label, errorMessage, ...props }, ref) => (
  <S.InputContainer>
    <S.ContentWrapper>
      {label && <S.Label>{label}</S.Label>}
      <S.StyledInput ref={ref} {...props} />
      {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
    </S.ContentWrapper>
  </S.InputContainer>
));

FormInputText.displayName = 'FormInputText';

export default FormInputText;
