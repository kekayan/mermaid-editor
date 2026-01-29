import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  fallback: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [key, state]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(value);
    },
    []
  );

  return [state, setValue];
}
