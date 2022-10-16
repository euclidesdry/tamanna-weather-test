export type CoordinatesType = {
  latitude: number;
  longitude: number;
};

export type WeatherContextType = {
  coordinateList: CoordinatesType[];
  addCoordinates(newCoordinate: CoordinatesType): CoordinatesType;
  updateCoordinates(
    newCoordinate: CoordinatesType,
    coordinateId: number
  ): number;
  removeCoordinates(coordinateId: number): number;
  clearCoordinates(): void;
};
