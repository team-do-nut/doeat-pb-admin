import styled from '@emotion/styled';
import { SmallSquareButtonType } from '.';

export const StyledActionButton = styled.button<{ $variant: SmallSquareButtonType }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant }) => {
    switch ($variant) {
      case 'edit':
        return `
          background-color: #ebf8ff;
          color: #3182ce;
          border: 1px solid #bee3f8;
          
          &:hover {
            background-color: #bee3f8;
          }
        `;
      case 'delete':
        return `
          background-color: #fff5f5;
          color: #e53e3e;
          border: 1px solid #fed7d7;
          
          &:hover {
            background-color: #fed7d7;
          }
        `;
      case 'save':
        return `
          background-color: #f0fff4;
          color: #38a169;
          border: 1px solid #c6f6d5;
          
          &:hover {
            background-color: #c6f6d5;
          }
        `;
      case 'cancel':
        return `
          background-color: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
          
          &:hover {
            background-color: #e2e8f0;
          }
        `;
      default:
        return '';
    }
  }}
`;
