import axiosService from "../service/axiosService";
import { WeatherResponseType } from "../types/weather";
import { IAPIResponseTemplate } from "../types/api";

const API_URL = "https://api.openweathermap.org";

const API_KEY = import.meta.env.VITE_OPEN_MAP_WEATHER_API_KEY;

export async function getWeather(
  latitude: number | string,
  longitude: number | string
): Promise<IAPIResponseTemplate<WeatherResponseType>> {
  const coordinates = `lat=${latitude}&lon=${longitude}`;
  return axiosService.get<WeatherResponseType>(
    `${API_URL}/data/2.5/onecall?appid=${API_KEY}&${coordinates}&units=metric&exclude=minutely,hourly,alerts`
  );
}
