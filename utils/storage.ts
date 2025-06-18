const STORAGE_KEY = "weather_users";

export const saveToStorage = <T>(data: T): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save data:", error);
  }
};

export const loadFromStorage = <T>(): T | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn("Failed to load data:", error);
    return null;
  }
};
