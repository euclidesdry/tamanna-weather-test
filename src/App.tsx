import React from "react";
import "./App.css";
import { Divider, Input, Modal, Select, Switch } from "antd";
import { useCurrentPosition } from "react-use-geolocation";
import { WeatherCard } from "./components/cards/Card";
import { useWeatherContext } from "./contexts/weatherContext";
import { COUNTRY_LIST } from "./constants/country";
import { getWeatherByCountryAndState } from "./apis/weather";

const { Option } = Select;

type LocationType = { country?: string; state?: string };

const selectBefore = (
  setLocation: React.Dispatch<React.SetStateAction<LocationType | undefined>>
) => (
  <Select
    defaultValue="PT"
    className="select-before"
    onChange={(value) => {
      setLocation((oldLocation) => ({
        ...oldLocation,
        country: value,
      }));
    }}
    style={{ minWidth: "160px" }}
  >
    {COUNTRY_LIST.map(({ value, label }) => (
      <Option value={value}>{label}</Option>
    ))}
  </Select>
);

function App() {
  const [position, error] = useCurrentPosition();
  const {
    coordinateList,
    addCoordinates,
    updateCoordinates,
    clearCoordinates,
  } = useWeatherContext();
  const [newLocation, setNewLocation] = React.useState<LocationType>({
    country: "PT",
    state: "Lisboa",
  });
  const [isVisible, setIsVisible] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    console.log("::::: New Location: ", newLocation);
  }, [newLocation]);

  const onChange = (checked: boolean) => {
    setIsVisible(!checked);
  };

  const onAddCard = () => {
    setIsModalOpen(true);
  };

  const handleAddNewCard = async () => {
    try {
      if (newLocation?.country && newLocation?.state) {
        const { data: response } = await getWeatherByCountryAndState(
          newLocation?.country,
          newLocation?.state
        );

        if (response.length <= 0) throw new Error("Error to get this Location");
        if (response.length > 0) {
          addCoordinates({
            latitude: response[0].lat,
            longitude: response[0].lon,
          });
        }
      }

      setIsModalOpen(false);
    } catch (e) {}
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleUpdateCountryState(
    element: React.ChangeEvent<HTMLInputElement> | undefined
  ) {
    if (element) {
      setNewLocation((oldLocation) => ({
        ...oldLocation,
        state: element?.target.value,
      }));
    }
  }

  React.useEffect(() => {
    console.log("🌐 Geolocation API", position, error);

    const latitude = position?.coords?.latitude as number | undefined;
    const longitude = position?.coords?.longitude as number | undefined;

    if (
      latitude &&
      longitude &&
      latitude !== coordinateList[0].latitude &&
      longitude !== coordinateList[0].longitude
    ) {
      updateCoordinates(
        {
          latitude,
          longitude,
        },
        0
      );
    }

    if (!latitude && !longitude && error) {
      clearCoordinates();
    }
  }, [position, error]);

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
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        {/* <Switch checked={!isVisible} onChange={onChange} /> */}
        {coordinateList && coordinateList.length > 0
          ? coordinateList.map((currentCoordinate, index) => (
              <WeatherCard
                key={index}
                cardId={index}
                lastCard={coordinateList.length - 1}
                location={currentCoordinate}
                onAddNewCard={onAddCard}
              />
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
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleAddNewCard}
        onCancel={handleCancel}
      >
        <Input
          addonBefore={selectBefore(setNewLocation)}
          defaultValue="mysite"
          onChange={handleUpdateCountryState}
        />
      </Modal>
    </div>
  );
}

export default App;
