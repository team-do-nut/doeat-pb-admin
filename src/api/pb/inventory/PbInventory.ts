import apiClient from '@src/libs/axios/apiClient';
import {
  GetInventoryRecordResponse,
  InventoryItemDto,
  ItemPriceHistoryDto,
  PostInventoryItemRequest,
  PostItemPriceHistoryCreateRequest,
  GetInventoryRecordRequest,
  PostInventoryRecordRequest,
  InventoryRecordsDto,
  PutInventoryRecordRequest,
  GetItemPriceHistoryResponse,
} from './PbInventory.types';

class PbInventoryApi {
  static getInventoryRecordsApiKey = '/pb/inventory/records';
  static getInventoryRecords = async ({ start, end }: GetInventoryRecordRequest) => {
    const res = await apiClient.get<GetInventoryRecordResponse[]>(this.getInventoryRecordsApiKey, {
      params: { start, end },
    });
    return res.data;
  };

  static postInventoryRecords = async (request: PostInventoryRecordRequest[]) => {
    const res = await apiClient.post<InventoryRecordsDto[]>('/pb/inventory/inventory-records', request);
    return res.data;
  };

  static putInventoryRecord = async ({ id, ...request }: PutInventoryRecordRequest) => {
    const res = await apiClient.put<InventoryRecordsDto>(`/pb/inventory/inventory-records/${id}`, request);
    return res.data;
  };

  static getAllItemsApiKey = '/pb/inventory/items/all';
  static getAllItems = async () => {
    const res = await apiClient.get<InventoryItemDto[]>(this.getAllItemsApiKey);
    return res.data;
  };

  static postItem = async (request: PostInventoryItemRequest[]) => {
    const res = await apiClient.post<InventoryItemDto[]>('/pb/inventory/item', request);
    return res.data;
  };

  static getItemPriceHistoryApiKey = '/pb/inventory/item-price-history';
  static getItemPriceHistory = async ({ start, end }: GetInventoryRecordRequest) => {
    const res = await apiClient.get<GetItemPriceHistoryResponse[]>(this.getItemPriceHistoryApiKey, {
      params: { start, end },
    });
    return res.data;
  };

  static postItemPriceHistory = async (request: PostItemPriceHistoryCreateRequest[]) => {
    const res = await apiClient.post<ItemPriceHistoryDto>('/pb/inventory/item-price-history', request);
    return res.data;
  };
}

export default PbInventoryApi;
