type TempType = {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
};

type FeelsLikeType = {
  day: number;
  night: number;
  eve: number;
  morn: number;
};

export type MainCondition =
  | "Thunderstorm"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Atmosphere"
  | "Clear"
  | "Clouds";

export type WeatherType = {
  id: number;
  main: MainCondition;
  description: string;
  icon: string;
};

export type DailyType = {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: TempType;
  feels_like: FeelsLikeType;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: WeatherType[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
};

export type CurrentType = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherType[];
};

export type WeatherResponseType = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentType;
  daily: DailyType[];
};

export type NewWeatherResponseType =
  | Array<{
      country: string;
      lat: number;
      lon: number;
      local_names: object;
      name: string;
      state: string;
    }>
  | [];
