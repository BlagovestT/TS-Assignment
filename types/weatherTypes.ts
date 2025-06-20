import z from "zod";

export const CoordinateResponseSchema = z.object({
  results: z.array(
    z.object({
      geometry: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    })
  ),
});

export type CoordinateResponse = z.infer<typeof CoordinateResponseSchema>;

export type Weather = {
  temp: number;
  humidity: number;
  condition: string;
};

export const WeatherResponseSchema = z.object({
  current: z.object({
    temperature_2m: z.number().min(-100).max(60),
    relative_humidity_2m: z.number().min(0).max(100),
    weather_code: z.number(),
  }),
});

export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;
