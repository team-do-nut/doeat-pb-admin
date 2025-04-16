import { ButtonHTMLAttributes, forwardRef } from 'react';
import * as S from './styles';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface BigSquareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const BigSquareButton = forwardRef<HTMLButtonElement, BigSquareButtonProps>(
  ({ children, variant = 'primary', fullWidth = false, isLoading = false, ...props }, ref) => (
    <S.StyledButton ref={ref} variant={variant} fullWidth={fullWidth} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <S.LoadingSpinner />}
      {children}
    </S.StyledButton>
  ),
);

BigSquareButton.displayName = 'BigSquareButton';

export default BigSquareButton;
