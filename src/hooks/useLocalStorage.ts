import { useState } from 'react';

export type SetStoredValue<T> = (value: T | ((current: T) => T)) => void;

export type MigrateStoredValue<T> = (value: unknown) => T;

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  migrate?: MigrateStoredValue<T>,
): [T, SetStoredValue<T>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (!rawValue) return initialValue;

      const parsed = JSON.parse(rawValue) as unknown;
      return migrate ? migrate(parsed) : (parsed as T);
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
