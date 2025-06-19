import { fetchApi } from "../utils/fetch.js";
import { User, ApiUserResponse } from "../types/userTypes.js";
import { ApiUserResponseSchema, UserSchema } from "../types/userTypes.js";
import { USER_API_URL } from "../utils/constants.js";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const data = await fetchApi(USER_API_URL);

    const validatedDataResponse = ApiUserResponseSchema.parse(data);

    const mappedUsers: User[] = validatedDataResponse.results.map((user) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      photo: user.picture.large,
      city: user.location.city,
      country: user.location.country,
      weather: null,
    }));

    const validatedUsers = mappedUsers.map((user) => UserSchema.parse(user));
    return validatedUsers;
  } catch (error) {
    console.error("Failed to fetch or validate users:", error);
    throw new Error("Invalid user data received from API");
  }
};
