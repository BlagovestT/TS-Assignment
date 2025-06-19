import { fetchApi } from "../utils/fetch.js";
import { User } from "../types/userTypes.js";
import { UserSchema } from "../types/userTypes.js";
import { retry } from "../utils/retry.js";
import {
  Weather,
  CoordinateResponse,
  WeatherResponse,
} from "../types/weatherTypes.js";
import {
  CoordinateResponseSchema,
  WeatherResponseSchema,
  WeatherSchema,
} from "../types/weatherTypes.js";

import {
  GEO_API_KEY,
  GEO_API_URL,
  WEATHER_API_URL,
  WEATHER_CODES,
} from "../utils/constants.js";

const getWeatherDescription = (code: number): string =>
  WEATHER_CODES[code] || "Unknown";

const getCoordinates = async (city: string, country: string) => {
  try {
    const query = `${city}, ${country}`;
    const url = `${GEO_API_URL}?q=${encodeURIComponent(
      query
    )}&key=${GEO_API_KEY}&limit=1`;

    const data = await fetchApi(url);

    const validatedDataResponse: CoordinateResponse =
      CoordinateResponseSchema.parse(data);

    return validatedDataResponse.results?.[0]?.geometry;
  } catch (error) {
    console.error(`Failed to get coordinates for ${city}, ${country}:`, error);
    return null;
  }
};

const getWeatherData = async (lat: number, lng: number): Promise<Weather> => {
  try {
    const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code`;

    const data = await fetchApi(url);

    const validatedDataResponse: WeatherResponse =
      WeatherResponseSchema.parse(data);

    const weather = {
      temp: Math.round(validatedDataResponse.current.temperature_2m),
      humidity: validatedDataResponse.current.relative_humidity_2m,
      condition: getWeatherDescription(
        validatedDataResponse.current.weather_code
      ),
    };
    return WeatherSchema.parse(weather);
  } catch (error) {
    console.error(
      `Failed to get weather data for coordinates ${lat}, ${lng}:`,
      error
    );
    throw error;
  }
};

export const addWeatherToUsers = async (users: User[]): Promise<User[]> => {
  return Promise.all(
    users.map(async (user): Promise<User> => {
      try {
        const coordinates = await getCoordinates(user.city, user.country);
        if (!coordinates) {
          return { ...user, weather: null };
        }

        const weather = await getWeatherData(coordinates.lat, coordinates.lng);
        const updatedUser = { ...user, weather };

        return UserSchema.parse(updatedUser);
      } catch (error) {
        console.warn(`Failed to get weather for ${user.name}:`, error);
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
          () => getCoordinates(user.city, user.country),
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

        const updatedUser = { ...user, weather };

        // Validate the updated user object
        return UserSchema.parse(updatedUser);
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
