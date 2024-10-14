"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import Loader from "@/components/loader";

interface GlobalContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(false);

  useLayoutEffect(() => {
    setIsInit(true);
  }, []);

  return (
    <GlobalContext.Provider value={{ loading, setLoading }}>
      {children}
      {isInit ? (
        <Loader loading={loading} />
      ) : (
        <div className="absolute bg-[white] bg-opacity-75 z-20 inset-0 h-full w-full flex items-center justify-center"></div>
      )}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
