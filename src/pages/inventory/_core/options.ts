import { InventoryType, PbItemTaxType, PbItemType } from '@src/api/pb/inventory/PbInventory.types';
import { InventoryTabProps } from '../_components/InventoryTab';

export const INVENTORY_TAB_ITEMS: InventoryTabProps['items'] = [
  {
    label: '재고 조회 및 수정',
    value: 0,
  },
  {
    label: '재고 추가하기',
    value: 1,
  },
];

export const INVENTORY_ITEM_HISTORY_TAB_ITEMS: InventoryTabProps['items'] = [
  {
    label: '단가 조회',
    value: 0,
  },
  {
    label: '단가 추가하기',
    value: 1,
  },
];

export const INVENTORY_TAX_TYPE_SELECT_OPTIONS: { value: PbItemTaxType; label: string }[] = [
  {
    value: 'NONE',
    label: '비과세',
  },
  {
    value: 'TAX',
    label: '과세',
  },
];

export const INVENTORY_ITEM_TYPE_SELECT_OPTIONS: { value: PbItemType; label: string }[] = [
  {
    value: 'INGREDIENT',
    label: '재료',
  },
  {
    value: 'PACKAGING',
    label: '묶음',
  },
];

export const INVENTORY_TYPE_SELECT_OPTIONS: { value: InventoryType; label: string }[] = [
  {
    value: 'INCOME',
    label: '입고',
  },
  {
    value: 'STOCK',
    label: '출고',
  },
];
