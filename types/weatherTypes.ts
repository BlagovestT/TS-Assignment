export type Weather = {
  temp: number;
  humidity: number;
  condition: string;
};

export type CoordinateResponse = {
  results: Array<{
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
};

export type WeatherResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
};
