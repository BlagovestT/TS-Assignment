import { fetchUsers } from "./services/userService.js";
import { addWeatherToUsers, refreshUsersWeather, } from "./services/weatherService.js";
import { renderUsers, showLoading, showWeatherLoading, addSpinnerStyles, } from "./services/domService.js";
import { saveToStorage, loadFromStorage } from "./utils/storage.js";
(async function init() {
    let users = [];
    let refreshInterval;
    const fetchNewUsers = async () => {
        try {
            showLoading(true);
            const rawUsers = await fetchUsers();
            users = await addWeatherToUsers(rawUsers);
            renderUsers(users);
            saveToStorage(users);
            enableRefreshButton();
        }
        catch (error) {
            console.error("Error fetching users:", error);
        }
        finally {
            showLoading(false);
        }
    };
    const refreshWeather = async () => {
        if (!users.length)
            return;
        try {
            showLoading(true);
            showWeatherLoading();
            users = await refreshUsersWeather(users);
            renderUsers(users);
            saveToStorage(users);
        }
        catch (error) {
            console.error("Error refreshing weather:", error);
        }
        finally {
            showLoading(false);
        }
    };
    const enableRefreshButton = () => {
        const btn = document.getElementById("refresh-weather-btn");
        if (btn)
            btn.disabled = false;
    };
    const setupEventListeners = () => {
        document
            .getElementById("fetch-new-users-btn")
            ?.addEventListener("click", fetchNewUsers);
        document
            .getElementById("refresh-weather-btn")
            ?.addEventListener("click", refreshWeather);
    };
    const startAutoRefresh = () => {
        refreshInterval = window.setInterval(() => {
            if (users.length)
                refreshWeather();
        }, 10 * 60 * 1000);
    };
    addSpinnerStyles();
    setupEventListeners();
    const cachedUsers = loadFromStorage();
    if (cachedUsers?.length) {
        users = cachedUsers;
        renderUsers(users);
        enableRefreshButton();
    }
    else {
        await fetchNewUsers();
    }
    startAutoRefresh();
    window.addEventListener("beforeunload", () => {
        if (refreshInterval)
            clearInterval(refreshInterval);
    });
})();
//# sourceMappingURL=main.js.map