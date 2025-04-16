import styled from '@emotion/styled';
import Link from 'next/link';

export const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

export const StyledLink = styled(Link)<{ $isSelected?: boolean }>`
  text-decoration: none;
  color: ${(props) => (props.$isSelected ? '#3182ce' : '#333')};
  font-weight: ${(props) => (props.$isSelected ? '600' : '500')};
  position: relative;
  padding: 0.5rem 0;

  &:after {
    content: '';
    position: absolute;
    width: ${(props) => (props.$isSelected ? '100%' : '0')};
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #3182ce;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #3182ce;

    &:after {
      width: 100%;
    }
  }
`;

export const LogoutButton = styled.button`
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e2e8f0;
    color: #1a365d;
  }
`;
