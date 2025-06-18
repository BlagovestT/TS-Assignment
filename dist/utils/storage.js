const STORAGE_KEY = "weather_users";
export const saveToStorage = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    catch (error) {
        console.warn("Failed to save data:", error);
    }
};
export const loadFromStorage = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        console.warn("Failed to load data:", error);
        return null;
    }
};
//# sourceMappingURL=storage.js.map