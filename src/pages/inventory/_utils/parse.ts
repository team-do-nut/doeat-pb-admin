import { PbItemTaxType, PbItemType } from '@src/api/pb/inventory/PbInventory.types';
import { INVENTORY_ITEM_TYPE_SELECT_OPTIONS, INVENTORY_TAX_TYPE_SELECT_OPTIONS } from '../_core/options';

export const getInventoryTaxTypeLabel = (value: PbItemTaxType): string =>
  INVENTORY_TAX_TYPE_SELECT_OPTIONS.find((item) => item.value === value)?.label || '';

export const getInventoryItemTypeLabel = (value: PbItemType): string =>
  INVENTORY_ITEM_TYPE_SELECT_OPTIONS.find((item) => item.value === value)?.label || '';
