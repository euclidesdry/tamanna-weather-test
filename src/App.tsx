import React from "react";
import "./App.css";
import { Divider, Switch } from "antd";
import { useCurrentPosition } from "react-use-geolocation";
import { MainCard } from "./components/cards/MainCard";
import { CoordinatesType } from "./@types/contexts/weather";
import { useWeatherContext } from "./contexts/weatherContext";

function App() {
  const [position, error] = useCurrentPosition();
  const { coordinateList } = useWeatherContext();
  const [coordinates, setCoordinates] = React.useState<CoordinatesType>({
    latitude: 38.7259284,
    longitude: -9.137382,
  });
  const [isVisible, setIsVisible] = React.useState(true);

  const onChange = (checked: boolean) => {
    setIsVisible(!checked);
  };

  React.useEffect(() => {
    console.log("🌐 Geolocation API", position);

    const latitude = position?.coords?.latitude as number | undefined;
    const longitude = position?.coords?.longitude as number | undefined;

    if (
      latitude &&
      longitude &&
      latitude !== coordinates.latitude &&
      longitude !== coordinates.longitude
    ) {
      setCoordinates((oldCoordinates) => ({
        ...oldCoordinates,
        latitude,
        longitude,
      }));
    }
  }, [position]);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img
            src="/assets/img/tamanna-logo.png"
            className="logo"
            alt="Tamanna logo"
          />
        </a>
      </div>
      <h1>Weather</h1>
      <div>
        <Switch checked={!isVisible} onChange={onChange} />
        {coordinateList && coordinateList.length > 0
          ? coordinateList.map((currentCoordinate, index) => (
              <MainCard key={index} location={currentCoordinate} />
            ))
          : null}
      </div>
      <Divider />
      <p className="read-the-docs">
        Created by{" "}
        <a href="https://github.com/euclidesdry" target="_blank">
          @euclidesdry
        </a>
      </p>
    </div>
  );
}

export default App;
