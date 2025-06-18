import { fetchApi } from "../utils/fetch.js";
import type { User, ApiUserResponse } from "../types/userTypes.js";
import { USER_API_URL } from "../utils/constants.js";

export const fetchUsers = async (): Promise<User[]> => {
  const data = await fetchApi<ApiUserResponse>(USER_API_URL);

  return data.results.map((user) => ({
    id: user.login.uuid,
    name: `${user.name.first} ${user.name.last}`,
    photo: user.picture.large,
    city: user.location.city,
    state: user.location.state,
    country: user.location.country,
    weather: null,
  }));
};
