import { FC } from 'react';
import { useRouter } from 'next/router';
import * as S from './styles';

const InventoryNavigation: FC = () => {
  const { pathname } = useRouter();

  return (
    <S.NavContainer>
      <S.StyledLink href="/inventory/record-history" selected={pathname === '/inventory/record-history'}>
        재고
      </S.StyledLink>
      <S.StyledLink href="/inventory/price-history" selected={pathname === '/inventory/price-history'}>
        단가
      </S.StyledLink>
      <S.StyledLink href="/inventory/item" selected={pathname === '/inventory/item'}>
        재료 품목
      </S.StyledLink>
    </S.NavContainer>
  );
};

export default InventoryNavigation;
