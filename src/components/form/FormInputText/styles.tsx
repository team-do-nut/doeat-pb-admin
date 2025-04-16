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
`;
export const Label = styled.label`
  font-weight: 500;
  color: #4a5568;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  }

  &::placeholder {
    color: #a0aec0;
  }

  &:read-only {
    background-color: #eee;
  }
`;

export const ErrorMessage = styled.span`
  color: #e53e3e;
  font-size: 12px;
`;
