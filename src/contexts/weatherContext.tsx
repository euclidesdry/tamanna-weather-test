import * as React from "react";
import { useLocalStorage } from "react-use";
import {
  CoordinatesType,
  WeatherContextType,
} from "../@types/contexts/weather";

const initialContextValue = [
  {
    latitude: 38.7259284,
    longitude: -9.137382,
  },
];

export const WeatherContext = React.createContext<WeatherContextType | null>(
  null
);

const WeatherContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cachedCoordinates, setCoordinateToStorage, removeCoordinateToStorage] =
    useLocalStorage<CoordinatesType[]>("TMN:WeatherList");

  const [coordinateList, setCoordinateList] = React.useState<CoordinatesType[]>(
    cachedCoordinates ? cachedCoordinates : initialContextValue
  );

  function addCoordinates(
    newCoordinate?: CoordinatesType
  ): CoordinatesType | undefined {
    if (newCoordinate) {
      setCoordinateList((currentCoordinates) => [
        ...currentCoordinates,
        newCoordinate,
      ]);
    }

    setCoordinateList(initialContextValue);

    return newCoordinate;
  }

  function updateCoordinates(
    newCoordinate: CoordinatesType,
    coordinateId: number
  ): number {
    setCoordinateList((currentCoordinates) =>
      currentCoordinates.map((coordinate, index) => {
        if (index === coordinateId) return newCoordinate;
        return coordinate;
      })
    );
    return coordinateId;
  }

  function removeCoordinates(coordinateId: number): number {
    setCoordinateList((currentCoordinates) =>
      currentCoordinates.filter((c, index) => index !== coordinateId)
    );
    return coordinateId;
  }

  function clearCoordinates() {
    setCoordinateList(initialContextValue);
  }

  React.useEffect(() => {
    setCoordinateToStorage(coordinateList);
  }, [coordinateList]);

  return (
    <WeatherContext.Provider
      value={{
        coordinateList,
        addCoordinates,
        updateCoordinates,
        removeCoordinates,
        clearCoordinates,
      }}
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
