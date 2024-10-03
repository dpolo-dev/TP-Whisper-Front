/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState("Whisper");

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  );
};
