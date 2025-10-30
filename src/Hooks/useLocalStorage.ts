import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T | null = null
) => {
  const [state, setState] = useState<T | null>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.warn('UserLocalStorage: failed to write', error);
    }
  }, [key, state]);

  return [state, setState] as const;
};
