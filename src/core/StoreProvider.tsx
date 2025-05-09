import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { parse } from 'cookie';
import { ACCESS_STORE_ID } from '@src/constants/api/authKey';

interface StoreContextType {
  storeId: number | null;
  setStoreId: (id: number | null) => void;
}

const StoreContext = createContext<StoreContextType>({ storeId: null, setStoreId: () => {} });

export const useStore = () => useContext(StoreContext);

const StoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const [storeId, setStoreId] = useState<StoreContextType['storeId']>(null);

  useEffect(() => {
    const cookieStoreId = parse(document.cookie)[ACCESS_STORE_ID];
    if (!cookieStoreId) return;

    setStoreId(Number(cookieStoreId));
  }, []);

  return <StoreContext.Provider value={{ storeId, setStoreId }}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
