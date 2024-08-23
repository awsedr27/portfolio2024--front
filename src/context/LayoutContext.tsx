// DataContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context의 상태 타입 정의
interface DataContextType {
  cartListCnt: any; 
  setCartListCnt: (data: any) => void;

}

// 기본값을 설정합니다.
const LayoutContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const LayoutContextProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<any>(null);

  return (
    <LayoutContext.Provider value={{ cartListCnt: data, setCartListCnt: setData }}>
      {children}
    </LayoutContext.Provider>
  );
};

// 커스텀 훅을 사용하여 Context를 쉽게 사용할 수 있습니다.
export const useLayoutContext = (): DataContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayoutContext must be used within a LayoutContextProvider');
  }
  return context;
};
