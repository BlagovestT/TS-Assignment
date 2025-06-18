import { fetchUsers } from "./services/userService.js";
import {
  addWeatherToUsers,
  refreshUsersWeather,
} from "./services/weatherService.js";
import {
  renderUsers,
  showLoading,
  showWeatherLoading,
  addSpinnerStyles,
} from "./services/domService.js";
import { saveToStorage, loadFromStorage } from "./utils/storage.js";
import { User } from "./types/userTypes.js";

(async function init() {
  let users: User[] = [];
  let refreshInterval: number;

  const fetchNewUsers = async (): Promise<void> => {
    try {
      showLoading(true);
      const rawUsers = await fetchUsers();
      users = await addWeatherToUsers(rawUsers);
      renderUsers(users);
      saveToStorage(users);
      enableRefreshButton();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      showLoading(false);
    }
  };

  const refreshWeather = async (): Promise<void> => {
    if (!users.length) return;

    try {
      showLoading(true);
      showWeatherLoading();

      users = await refreshUsersWeather(users);

      renderUsers(users);

      saveToStorage(users);
    } catch (error) {
      console.error("Error refreshing weather:", error);
    } finally {
      showLoading(false);
    }
  };

  const enableRefreshButton = (): void => {
    const btn = document.getElementById(
      "refresh-weather-btn"
    ) as HTMLButtonElement;
    if (btn) btn.disabled = false;
  };

  const setupEventListeners = (): void => {
    document
      .getElementById("fetch-new-users-btn")
      ?.addEventListener("click", fetchNewUsers);
    document
      .getElementById("refresh-weather-btn")
      ?.addEventListener("click", refreshWeather);
  };

  const startAutoRefresh = (): void => {
    refreshInterval = window.setInterval(() => {
      if (users.length) refreshWeather();
    }, 10 * 60 * 1000);
  };

  addSpinnerStyles();
  setupEventListeners();

  const cachedUsers = loadFromStorage<User[]>();
  if (cachedUsers?.length) {
    users = cachedUsers;
    renderUsers(users);
    enableRefreshButton();
  } else {
    await fetchNewUsers();
  }

  startAutoRefresh();

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (refreshInterval) clearInterval(refreshInterval);
  });
})();
