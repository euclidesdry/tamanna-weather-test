import './App.css';

import { Alert, Divider, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { useCurrentPosition } from 'react-use-geolocation';

import { getWeatherByCountryAndState } from './apis/weather';
import { WeatherCard } from './components/Card';
import { COUNTRY_LIST } from './constants/country';
import { useWeatherContext } from './contexts/weatherContext';

const { Option } = Select;

type LocationType = { country?: string; state?: string };

const selectBefore = (setLocation: React.Dispatch<React.SetStateAction<LocationType>>) => (
  <Select
    defaultValue="PT"
    className="select-before"
    onChange={(value) => {
      setLocation((oldLocation) => ({
        ...oldLocation,
        country: value,
        state: 'Lisboa'
      }));
    }}
    style={{ minWidth: '160px' }}>
    {COUNTRY_LIST.map(({ value, label }) => (
      <Option key={value} value={value}>
        {label}
      </Option>
    ))}
  </Select>
);

function App() {
  const [position, error] = useCurrentPosition();
  const { coordinateList, addCoordinates, updateCoordinates, clearCoordinates } =
    useWeatherContext();
  const [newLocation, setNewLocation] = React.useState<LocationType>({
    country: 'PT',
    state: 'Lisboa'
  });
  const [isVisible, setIsVisible] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('::::: New Location: ', newLocation);
  }, [newLocation]);

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

        if (response.length <= 0) {
          const ErrorMessage = `Error getting the "Weather Forecast" for ${newLocation.state}.`;
          message.error(ErrorMessage);
          setModalError(ErrorMessage);
          throw new Error(ErrorMessage);
        }

        if (response.length > 0) {
          setModalError(null);

          addCoordinates({
            latitude: response[0].lat,
            longitude: response[0].lon
          });

          message.success(
            `The "Weather Forecast" ${newLocation.state} has been added successfully!`
          );
        }
      }

      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleUpdateCountryState(element: React.ChangeEvent<HTMLInputElement> | undefined) {
    if (element) {
      setNewLocation((oldLocation) => ({
        ...oldLocation,
        state: element?.target.value
      }));
    }
  }

  React.useEffect(() => {
    console.log('🌐 Geolocation API', position, error);

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
          longitude
        },
        0
      );
    } else {
      addCoordinates();
    }

    if (!latitude && !longitude && error) {
      clearCoordinates();
    }
  }, [position, error]);

  return (
    <div className="App">
      <div>
        <a href="https://www.tamanna.com" target="_blank" rel="noopener noreferrer">
          <img src="/assets/img/tamanna-logo.png" className="logo" alt="Tamanna logo" />
        </a>
      </div>
      <h1>Weather</h1>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
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
        Created by{' '}
        <a href="https://github.com/euclidesdry" target="_blank" rel="noopener noreferrer">
          @euclidesdry
        </a>
      </p>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleAddNewCard} onCancel={handleCancel}>
        {modalError ? (
          <Alert message={modalError} type="error" style={{ marginBottom: '8px' }} />
        ) : null}

        <Input
          addonBefore={selectBefore(setNewLocation)}
          defaultValue="Lisboa"
          onChange={handleUpdateCountryState}
        />
      </Modal>
    </div>
  );
}

export default App;
