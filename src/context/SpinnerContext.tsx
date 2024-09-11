import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SpinnerContextProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpinnerContext = createContext<SpinnerContextProps>({
  loading: false,
  setLoading: () => {}
});

export const useSpinner = () => useContext(SpinnerContext);


interface SpinnerProviderProps {
  children: ReactNode;
}


export const SpinnerProvider: React.FC<SpinnerProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = ''; 
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);


  return (
    <SpinnerContext.Provider value={{ loading:loading, setLoading:setLoading}}>
      {children}
    </SpinnerContext.Provider>
  );
};
