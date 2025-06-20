import { fetchApi } from "../utils/fetch.js";
import { User, ApiUserResponse } from "../types/userTypes.js";
import { ApiUserResponseSchema } from "../types/userTypes.js";
import { USER_API_URL } from "../utils/constants.js";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const data = await fetchApi(USER_API_URL);

    const parseApiResult = ApiUserResponseSchema.safeParse(data);

    if (!parseApiResult.success) {
      console.error("Invalid API response format:", parseApiResult.error);
      throw new Error("Invalid user data received from API");
    }

    const validatedDataResponse: ApiUserResponse = parseApiResult.data;

    const mappedUsers: User[] = validatedDataResponse.results.map((user) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      photo: user.picture.large,
      city: user.location.city,
      country: user.location.country,
    }));

    return mappedUsers;
  } catch (error) {
    console.error("Failed to fetch or validate users:", error);
    throw new Error("Invalid user data received from API");
  }
};
