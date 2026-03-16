"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import en from "@/configs/messages/en.json";
import vi from "@/configs/messages/vi.json";

const dictionaries: Record<string, unknown> = { en, vi };
type Language = "en" | "vi";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string; 
}

export const LanguageContext = React.createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const useLanguage = () => React.useContext(LanguageContext);

export function Providers({ 
  children, 
  initialLang 
}: { 
  children: React.ReactNode; 
  initialLang: Language; 
}) {
  const [lang, setLang] = React.useState<Language>(initialLang);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    document.cookie = `language=${newLang}; path=/; max-age=31536000`;
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = dictionaries[lang];
    
    for (const k of keys) {
      if (value === undefined || value === null) break;
      value = value?.[k];
    }
    
    return typeof value === "string" ? value : key; 
  };

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
        {children}
      </LanguageContext.Provider>
    </NextThemesProvider>
  );
}