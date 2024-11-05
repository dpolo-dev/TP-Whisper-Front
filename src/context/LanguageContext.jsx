/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        targetLanguage,
        setTargetLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
