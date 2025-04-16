export type InventoryType = 'INCOME' | 'STOCK';
export type PbItemType = 'INGREDIENT' | 'PACKAGING' | 'MIXTURE';
export type PbItemTaxType = 'TAX' | 'NONE';

/* Record */
export interface GetInventoryRecordRequest {
  start: string;
  end: string;
}

export interface GetInventoryRecordResponse {
  id: number;
  itemId: number;
  itemName: string;
  unit: string;
  date: string;
  createdAt: string;
  lastModifiedAt: string;
  quantity: number;
  type: InventoryType;
}

export interface PostInventoryRecordRequest {
  itemId: number;
  quantity: number;
  type: InventoryType;
  date: string;
}

export interface PutInventoryRecordRequest extends PostInventoryRecordRequest {
  id: number;
}

export interface InventoryRecordsDto {
  id: number;
  itemId: number;
  quantity: number;
  type: InventoryType;
  date: string;
  createdAt: string;
  lastModifiedAt: string;
}

/* Item */
export interface InventoryItemDto {
  id: number;
  name: string;
  unit: string;
  type: PbItemType;
  taxType: PbItemTaxType;
}

export interface PostInventoryItemRequest {
  name: string;
  unit: string;
  type: PbItemType;
  taxType: PbItemTaxType;
}

/* ItemHistory */
export interface ItemPriceHistoryDto {
  id: number;
  itemId: number;
  price: number;
  date: string;
}

export interface GetItemPriceHistoryResponse extends ItemPriceHistoryDto {
  itemName: string;
}

export interface PostItemPriceHistoryCreateRequest {
  itemId: number;
  price: number;
  date: string;
}
