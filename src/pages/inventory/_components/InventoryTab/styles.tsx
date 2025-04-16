import styled from '@emotion/styled';

export const TabContainer = styled.div`
  display: flex;
  padding: 12px 20px;
`;

export const TabItem = styled.div<{ $isActive: boolean }>`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
  color: ${({ $isActive }) => ($isActive ? '#111827' : '#6b7280')};
  border-bottom: ${({ $isActive }) => ($isActive ? '2px solid #111827' : 'none')};
  margin-bottom: ${({ $isActive }) => ($isActive ? '-1px' : '0')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#111827' : '#4b5563')};
  }
`;
