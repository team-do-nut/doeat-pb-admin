import { FC } from 'react';
import * as S from './styles';

type InventoryTabItem = { label: string; value: number };

export interface InventoryTabProps {
  items: InventoryTabItem[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const InventoryTab: FC<InventoryTabProps> = ({ items, activeTab, onTabChange }) => (
  <S.TabContainer>
    {items.map(({ label, value }) => (
      <S.TabItem key={value} $isActive={activeTab === value} onClick={() => onTabChange(value)}>
        {label}
      </S.TabItem>
    ))}
  </S.TabContainer>
);

export default InventoryTab;
