import { ButtonHTMLAttributes, forwardRef } from 'react';
import * as S from './styles';

export type SmallSquareButtonType = 'edit' | 'delete' | 'save' | 'cancel';

interface SmallSquareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: SmallSquareButtonType;
}

const SmallSquareButton = forwardRef<HTMLButtonElement, SmallSquareButtonProps>(
  ({ variant, children, ...props }, ref) => (
    <S.StyledActionButton $variant={variant} ref={ref} {...props}>
      {children}
    </S.StyledActionButton>
  ),
);

SmallSquareButton.displayName = 'SmallSquareButton';

export default SmallSquareButton;
