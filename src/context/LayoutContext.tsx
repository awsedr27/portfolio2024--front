import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  cartListCnt: any; 
  setCartListCnt: (data: any) => void;

}

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

export const useLayoutContext = (): DataContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayoutContext must be used within a LayoutContextProvider');
  }
  return context;
};
