import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const PawModeContext = createContext(null);
const STORAGE_KEY = 'flatcat_paw_mode';

export function PawModeProvider({ children }) {
  const [pawMode, setPawMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [pawCount, setPawCount] = useState(0);
  const [clearSignal, setClearSignal] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, pawMode ? '1' : '0');
    } catch {
      /* ignore */
    }
    document.body.classList.toggle('paw-mode-active', pawMode);
  }, [pawMode]);

  const togglePawMode = useCallback(() => {
    setPawMode((v) => !v);
  }, []);

  const incrementPawCount = useCallback(() => {
    setPawCount((c) => c + 1);
  }, []);

  const clearPaws = useCallback(() => {
    setPawCount(0);
    setClearSignal((s) => s + 1);
  }, []);

  return (
    <PawModeContext.Provider value={{
      pawMode,
      togglePawMode,
      pawCount,
      incrementPawCount,
      clearPaws,
      clearSignal,
    }}>
      {children}
    </PawModeContext.Provider>
  );
}

export function usePawMode() {
  const ctx = useContext(PawModeContext);
  if (!ctx) throw new Error('usePawMode must be used within PawModeProvider');
  return ctx;
}
