import { Weather } from "./weatherTypes";

export type User = {
  id: string;
  name: string;
  photo: string;
  city: string;
  state: string;
  country: string;
  weather: null | Weather;
};

export type ApiUserResponse = {
  results: ApiUser[];
};

export type ApiUser = {
  login: { uuid: string };
  name: { first: string; last: string };
  picture: { large: string };
  location: { city: string; state: string; country: string };
};
