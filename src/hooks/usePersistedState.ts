import { useEffect, useState } from "react";

// useState som overlever at siden lastes på nytt, ved hjelp av localStorage.
export function usePersistedState<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        const parsed: unknown = JSON.parse(stored);
        if (isValid(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Utilgjengelig eller ødelagt lagring: start med blanke ark.
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Spillet fungerer fortsatt, men huskes ikke etter omlasting.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
