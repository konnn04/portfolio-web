"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface HeaderConfig {
  isHiddenUntilScroll: boolean;
  noBGUntilScroll: boolean;
  scrollThreshold: number;
}

interface HeaderContextType {
  config: HeaderConfig;
  setConfig: (config: Partial<HeaderConfig>) => void;
}

const defaultConfig: HeaderConfig = {
  isHiddenUntilScroll: false,
  noBGUntilScroll: false,
  scrollThreshold: 300,
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<HeaderConfig>(defaultConfig);

  const setConfig = useCallback((newConfig: Partial<HeaderConfig>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return (
    <HeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
