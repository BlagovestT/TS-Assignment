import { fetchApi } from "../utils/fetch.js";
import { USER_API_URL } from "../utils/constants.js";
export const fetchUsers = async () => {
    const data = await fetchApi(USER_API_URL);
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
//# sourceMappingURL=userService.js.map