import React from "react";
import "./App.css";
import { Divider, Switch } from "antd";
import { useCurrentPosition } from "react-use-geolocation";
import { MainCard } from "./components/cards/MainCard";

type CoordinatesType = {
  latitude: number;
  longitude: number;
};

function App() {
  // const state = useGeolocation();
  const [position, error] = useCurrentPosition();
  const [coordinates, setCoordinates] = React.useState<CoordinatesType>({
    latitude: 38.7259284,
    longitude: -9.137382,
  });
  const [loading, setLoading] = React.useState(false);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
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
  }, [position?.coords]);

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
        <Switch checked={!loading} onChange={onChange} />
        {position || !loading ? (
          <MainCard location={coordinates} loading={loading} />
        ) : (
          ""
        )}
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
