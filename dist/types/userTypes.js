import z from "zod";
import { WeatherSchema } from "./weatherTypes";
export const ApiUserResponseSchema = z.object({
    results: z.array(z.object({
        name: z.object({
            first: z.string().min(1).max(60),
            last: z.string().min(1).max(60),
        }),
        location: z.object({
            city: z.string().min(1).max(50),
            country: z.string().min(1).max(50),
        }),
        login: z.object({
            uuid: z.string().uuid(),
        }),
        picture: z.object({
            large: z.string().url(),
        }),
    })),
});
export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string(),
    city: z.string(),
    country: z.string(),
    weather: WeatherSchema.nullable(),
});
//# sourceMappingURL=userTypes.js.map