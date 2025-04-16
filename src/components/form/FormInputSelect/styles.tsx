import styled from '@emotion/styled';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: 20px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  position: relative;
`;

export const LabelText = styled.label`
  font-weight: 500;
  color: #4a5568;
`;

export const SelectContainer = styled.div<{ isOpen: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ isOpen }) => (isOpen ? '#3182ce' : '#e2e8f0')};
  border-radius: 4px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e0;
  }

  ${({ isOpen }) =>
    isOpen &&
    `
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  `}
`;

export const SelectText = styled.span<{ isSelected: boolean }>`
  color: ${({ isSelected }) => (isSelected ? '#4a5568' : '#a0aec0')};
`;

export const CaretIcon = styled.div<{ isOpen: boolean }>`
  width: 10px;
  height: 10px;
  border-style: solid;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 2px;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(-135deg)' : 'rotate(45deg)')};
  transition: transform 0.2s ease;
`;

export const DropdownList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const DropdownItem = styled.li<{ isSelected: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ isSelected }) => (isSelected ? '#EBF8FF' : 'transparent')};
  color: ${({ isSelected }) => (isSelected ? '#3182ce' : '#4a5568')};

  &:hover {
    background-color: #f7fafc;
  }
`;

export const CheckMark = styled.span`
  width: 16px;
  height: 16px;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #3182ce;
  }

  &::before {
    width: 2px;
    height: 10px;
    transform: rotate(45deg);
    top: 2px;
    left: 8px;
  }

  &::after {
    width: 2px;
    height: 5px;
    transform: rotate(-45deg);
    top: 7px;
    left: 4px;
  }
`;

export const ErrorMessage = styled.span`
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
`;
