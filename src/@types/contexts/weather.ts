export type CoordinatesType = {
  latitude: number;
  longitude: number;
};

export type WeatherContextType = {
  coordinateList: CoordinatesType[];
  addCoordinates(newCoordinate: CoordinatesType): CoordinatesType;
  removeCoordinates(coordinateId: number): number;
};
