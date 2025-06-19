const createWeatherHTML = (weather) => {
    if (!weather) {
        return `
      <div class="weather-section">
        <div class="weather-title">🌦️ Weather</div>
        <div class="weather-error">Weather unavailable</div>
      </div>
    `;
    }
    return `
    <div class="weather-section">
      <div class="weather-title">🌦️ Current Weather</div>
      <div class="weather-content">
        <div class="temperature-display">
          <div class="temperature">${weather.temp}°C</div>
          <div class="condition">${weather.condition}</div>
        </div>
        <div class="weather-details">
          <div class="weather-item">Humidity: ${weather.humidity}%</div>
          <div class="weather-item">Condition: ${weather.condition}</div>
        </div>
      </div>
    </div>
  `;
};
const createUserCardHTML = (user) => {
    const location = `${user.city}, ${user.country}`;
    return `
    <div class="user-card" data-user-id="${user.id}">
      <div class="user-info">
        <img src="${user.photo}" alt="${user.name}" class="user-avatar" loading="lazy">
        <div class="user-name">${user.name}</div>
        <div class="user-location">📍 ${location}</div>
      </div>
      ${createWeatherHTML(user.weather)}
    </div>
  `;
};
export const renderUsers = (users) => {
    const container = document.getElementById("user-cards");
    if (!container)
        return;
    if (!users.length) {
        container.innerHTML = "<p>No users available.</p>";
        return;
    }
    container.innerHTML = users.map(createUserCardHTML).join("");
};
export const showLoading = (show) => {
    const loading = document.getElementById("loading");
    const refreshBtn = document.getElementById("refresh-weather-btn");
    const fetchBtn = document.getElementById("fetch-new-users-btn");
    loading?.classList.toggle("hidden", !show);
    if (refreshBtn)
        refreshBtn.disabled = show;
    if (fetchBtn)
        fetchBtn.disabled = show;
};
export const showWeatherLoading = () => {
    document.querySelectorAll(".weather-section").forEach((section) => {
        section.innerHTML = `
      <div class="weather-title">🌦️ Weather</div>
      <div class="weather-loading">
        <div class="spinner" style="width:20px;height:20px;border:3px solid #ccc;border-top:3px solid #333;border-radius:50%;animation:spin 1s linear infinite;display:inline-block;"></div>
        <span style="margin-left:8px;">Refreshing...</span>
      </div>
    `;
    });
};
export const addSpinnerStyles = () => {
    if (!document.getElementById("spinner-styles")) {
        const style = document.createElement("style");
        style.id = "spinner-styles";
        style.textContent =
            "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
        document.head.appendChild(style);
    }
};
//# sourceMappingURL=domService.js.map