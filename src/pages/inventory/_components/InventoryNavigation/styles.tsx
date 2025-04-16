import Link from 'next/link';
import styled from '@emotion/styled';

export const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 0;
  padding: 0 20px;
`;

export const StyledLink = styled(Link)<{ selected?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  padding: 0 1.5rem;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: ${({ selected }) => (selected ? '600' : '500')};
  color: ${({ selected }) => (selected ? '#2C5282' : '#4A5568')};
  transition: all 0.2s ease;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3182ce;
    opacity: ${({ selected }) => (selected ? '1' : '0')};
    transform: ${({ selected }) => (selected ? 'scaleX(1)' : 'scaleX(0)')};
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  &:hover {
    color: #2c5282;
    background-color: rgba(237, 242, 247, 0.5);

    &:after {
      opacity: ${({ selected }) => (selected ? '1' : '0.5')};
      transform: scaleX(1);
    }
  }
`;
