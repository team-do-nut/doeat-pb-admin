import { parse } from 'cookie';
import { ACCESS_STORE_ID } from '@src/constants/api/authKey';

export const getStoreId = (): number | null => {
  if (typeof window === 'undefined') return null;

  const storeId = parse(document.cookie)[ACCESS_STORE_ID];
  if (!storeId) return null;

  return Number(storeId);
};
