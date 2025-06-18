import { fetchApi } from "../utils/fetch.js";
import type { User } from "../types/userTypes.js";
import { retry } from "../utils/retry.js";
import type {
  Weather,
  CoordinateResponse,
  WeatherResponse,
} from "../types/weatherTypes.js";

import {
  GEO_API_KEY,
  GEO_API_URL,
  WEATHER_API_URL,
  WEATHER_CODES,
} from "../utils/constants.js";

const getWeatherDescription = (code: number): string =>
  WEATHER_CODES[code] || "Unknown";

const getCoordinates = async (city: string, state: string, country: string) => {
  const query = `${city}, ${state}, ${country}`;
  const url = `${GEO_API_URL}?q=${encodeURIComponent(
    query
  )}&key=${GEO_API_KEY}&limit=1`;

  const data = await fetchApi<CoordinateResponse>(url);
  return data.results?.[0]?.geometry || null;
};

const getWeatherData = async (lat: number, lng: number): Promise<Weather> => {
  const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code`;

  const data = await fetchApi<WeatherResponse>(url);
  return {
    temp: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    condition: getWeatherDescription(data.current.weather_code),
  };
};

export const addWeatherToUsers = async (users: User[]): Promise<User[]> => {
  return Promise.all(
    users.map(async (user): Promise<User> => {
      try {
        const coordinates = await getCoordinates(
          user.city,
          user.state,
          user.country
        );
        if (!coordinates) {
          return { ...user, weather: null };
        }

        const weather = await getWeatherData(coordinates.lat, coordinates.lng);
        return { ...user, weather };
      } catch (error) {
        console.warn(`Failed to get weather for ${user}:`, error);
        return { ...user, weather: null };
      }
    })
  );
};

export const refreshUsersWeather = async (users: User[]): Promise<User[]> => {
  return Promise.all(
    users.map(async (user): Promise<User> => {
      try {
        const coordinates = await retry(
          () => getCoordinates(user.city, user.state, user.country),
          3,
          1000
        );

        if (!coordinates) {
          return { ...user, weather: null };
        }

        const weather = await retry(
          () => getWeatherData(coordinates.lat, coordinates.lng),
          3,
          1000
        );

        return { ...user, weather };
      } catch (error) {
        console.warn(
          `Failed to refresh weather for ${user.name} after 3 retries:`,
          error
        );
        return { ...user, weather: null };
      }
    })
  );
};
