import React, { createContext, useContext, ReactNode } from 'react';
import { RootStore } from './RootStore';

// 创建 Context
const StoreContext = createContext<RootStore | null>(null);

// Store Provider 组件
interface StoreProviderProps {
  children: ReactNode;
  store?: RootStore;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ 
  children, 
  store = new RootStore() 
}) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

// 自定义 Hook 用于获取 store
export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};

// 导出便捷的 hooks
export const useUserStore = () => {
  const store = useStore();
  return store.userStore;
};

export const useAppStore = () => {
  const store = useStore();
  return store.appStore;
}; 