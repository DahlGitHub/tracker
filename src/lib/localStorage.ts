// utils/localStorage.js
export const getLocalData = <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  };
  
  export const setLocalData = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  