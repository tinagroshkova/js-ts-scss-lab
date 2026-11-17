import { useState } from 'react';

export type SetStoredValue<T> = (value: T | ((current: T) => T)) => void;

export const useLocalStorage = <T>(key: string, initialValue: T): [T, SetStoredValue<T>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const rawValue = window.localStorage.getItem(key);
      return rawValue ? (JSON.parse(rawValue) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: SetStoredValue<T> = (value) => {
    setStoredValue((current) => {
      const resolved = typeof value === 'function' ? (value as (current: T) => T)(current) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        return resolved;
      }
      return resolved;
    });
  };

  return [storedValue, setValue];
};
