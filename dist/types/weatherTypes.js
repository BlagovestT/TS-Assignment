import z from "zod";
export const CoordinateResponseSchema = z.object({
  results: z.array(
    z.object({
      geometry: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      }),
    })
  ),
});
export const WeatherSchema = z.object({
  temp: z.number(),
  humidity: z.number(),
  condition: z.string(),
});
export const WeatherResponseSchema = z.object({
  current: z.object({
    temperature_2m: z.number().min(-100).max(60),
    relative_humidity_2m: z.number().min(0).max(100),
    weather_code: z.number(),
  }),
});
//# sourceMappingURL=weatherTypes.js.map
