import styled from '@emotion/styled';
import { BigSquareButtonProps, ButtonVariant } from '.';

const getButtonStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return `
          background-color: #3182ce;
          color: white;
          
          &:hover:not(:disabled) {
            background-color: #2c5282;
          }
        `;
    case 'secondary':
      return `
          background-color: #4a5568;
          color: white;
          
          &:hover:not(:disabled) {
            background-color: #2d3748;
          }
        `;
    case 'outline':
      return `
          background-color: transparent;
          color: #3182ce;
          border: 1px solid #3182ce;
          
          &:hover:not(:disabled) {
            background-color: rgba(49, 130, 206, 0.1);
          }
        `;
    case 'danger':
      return `
          background-color: #e53e3e;
          color: white;
          
          &:hover:not(:disabled) {
            background-color: #c53030;
          }
        `;
    default:
      return '';
  }
};

export const StyledButton = styled.button<BigSquareButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  height: 3.5rem;

  ${({ variant = 'primary' }) => getButtonStyles(variant)}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
