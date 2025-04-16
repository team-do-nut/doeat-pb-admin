import { InventoryType, PbItemTaxType, PbItemType } from '@src/api/pb/inventory/PbInventory.types';

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
    label: '포장재',
  },
  {
    value: 'MIXTURE',
    label: '혼합물',
  },
];

export const INVENTORY_TYPE_SELECT_OPTIONS: { value: InventoryType; label: string }[] = [
  {
    value: 'INCOME',
    label: '입고',
  },
  {
    value: 'STOCK',
    label: '기말',
  },
];
