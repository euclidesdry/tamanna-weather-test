import * as React from "react";
import {
  CoordinatesType,
  WeatherContextType,
} from "../@types/contexts/weather";

export const WeatherContext = React.createContext<WeatherContextType | null>(
  null
);

const WeatherContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coordinateList, setCoordinateList] = React.useState<CoordinatesType[]>(
    [
      {
        latitude: 38.7259284,
        longitude: -9.137382,
      },
    ]
  );

  function addCoordinates(newCoordinate: CoordinatesType): CoordinatesType {
    setCoordinateList((currentCoordinates) => [
      ...currentCoordinates,
      newCoordinate,
    ]);
    return newCoordinate;
  }

  function removeCoordinates(coordinateId: number): number {
    setCoordinateList((currentCoordinates) =>
      currentCoordinates.filter((c, index) => index !== coordinateId)
    );
    return coordinateId;
  }

  return (
    <WeatherContext.Provider
      value={{ coordinateList, addCoordinates, removeCoordinates }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeatherContext() {
  const selectedContext = React.useContext(
    WeatherContext
  ) as WeatherContextType;

  return selectedContext;
}

export default WeatherContextProvider;
