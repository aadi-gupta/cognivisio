import { createContext, useContext, useState } from "react";

const PatternSpeedContext = createContext(null);

export function PatternSpeedProvider({ children }) {
  const [patternSpeed, setPatternSpeed] = useState(1);

  return (
    <PatternSpeedContext.Provider value={{ patternSpeed, setPatternSpeed }}>
      {children}
    </PatternSpeedContext.Provider>
  );
}

export function usePatternSpeed() {
  const context = useContext(PatternSpeedContext);

  if (!context) {
    throw new Error("usePatternSpeed must be used within PatternSpeedProvider");
  }

  return context;
}
