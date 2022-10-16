import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Card, Descriptions, Divider, Popconfirm, Skeleton } from 'antd';
import { format } from 'date-fns';
import React, { ReactNode } from 'react';
import ReactAnimatedWeather from 'react-animated-weather';

import { IAPIResponseTemplate } from '../../@types/api';
import { CurrentType, DailyType, MainCondition, WeatherResponseType } from '../../@types/weather';
import { getWeather } from '../../apis/weather';
import { useWeatherContext } from '../../contexts/weatherContext';
import weatherIcon from '../../helpers/weather-icon';
import { ListNextDays } from '../ListNextDays';

const defaults = {
  icon: 'CLEAR_DAY',
  color: 'goldenrod',
  size: 64,
  animate: true
};

type WeatherCardProps = {
  cardData?: {
    loading: boolean;
    data: IAPIResponseTemplate<WeatherResponseType> | undefined;
  };
  cardId: number;
  lastCard: number;
  location: { latitude: number; longitude: number };
  onAddNewCard: () => void;
};

export function WeatherCard({ cardId, lastCard, location, onAddNewCard }: WeatherCardProps) {
  const { removeCoordinates } = useWeatherContext();

  const [weatherQueryResponse, setWeatherQueryResponse] =
    React.useState<IAPIResponseTemplate<WeatherResponseType>>();
  const [currentTimezone, setCurrentTimezone] = React.useState<string | null>(null);
  const [currentTimezoneOffset, setCurrentTimezoneOffset] = React.useState<number>();
  const [currentAllDays, setCurrentAllDays] = React.useState<DailyType[] | null>(null);
  const [currentWeather, setCurrentWeather] = React.useState<CurrentType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const queryClient = useQueryClient();
  const queryStatus = queryClient.getQueryState(['weatherCard-query:' + cardId]);

  React.useEffect(() => {
    setIsLoading(queryStatus?.status === 'loading');
  }, [queryStatus]);

  React.useEffect(() => {
    (async function () {
      await queryClient.prefetchQuery(
        ['weatherCard-query:' + cardId],
        () => getWeather(location.latitude, location.longitude),
        {
          staleTime: 120000
        }
      );

      const queryData = queryClient.getQueryData<IAPIResponseTemplate<WeatherResponseType>>([
        'weatherCard-query:' + cardId
      ]);

      setWeatherQueryResponse(queryData);
    })();
  }, []);

  const loading = isLoading;

  const onSelectIcon = (mainCondition: MainCondition, date?: string | number) => ({
    ...defaults,
    icon: weatherIcon.icon.select(mainCondition, date)
  });

  const handleRemoveLocation = (id: number) => {
    removeCoordinates(id);
  };

  const handleAddLocation = () => {
    onAddNewCard();
  };

  const configActions = (): ReactNode[] => {
    let options = [
      <EditOutlined
        key="edit"
        title="Edit Card"
        onClick={() => {
          alert('Opps!! The Edit function will be available son...');
        }}
      />,
      <Popconfirm
        key="delete"
        placement="top"
        title={`Remove this ${currentTimezone} "Weather Forecast"?`}
        onConfirm={() => handleRemoveLocation(cardId)}
        okText="Yes, remove it!"
        cancelText="No">
        <DeleteOutlined title="Remove Card" />
      </Popconfirm>,
      <PlusOutlined key="add" onClick={() => handleAddLocation()} title="Add new Card" />
    ];
    if (lastCard !== cardId && lastCard > 0) {
      options = options.filter((_, index) => index !== 2);
    }

    return options;
  };

  React.useEffect(() => {
    if (weatherQueryResponse?.data) {
      setCurrentWeather(weatherQueryResponse.data.current);
      setCurrentTimezone(weatherQueryResponse.data.timezone);
      setCurrentTimezoneOffset(weatherQueryResponse.data.timezone_offset);
      setCurrentAllDays(weatherQueryResponse.data.daily);
    }
  }, [weatherQueryResponse?.data]);

  return (
    <Card className="weatherCard" size="small" title={currentTimezone} actions={configActions()}>
      <Skeleton loading={loading} avatar active>
        {currentWeather?.weather ? (
          <>
            <ReactAnimatedWeather
              {...onSelectIcon(
                currentWeather?.weather[0].main,
                currentWeather?.dt + (currentTimezoneOffset ? currentTimezoneOffset : 0)
              )}
            />
            <Descriptions
              title={`Today, ${format(new Date(currentWeather?.dt * 1000), 'LLLL do, yyyy')}`}
              size="small"
              column={1}>
              <Descriptions.Item label="Status">
                {`Win. ${currentWeather.wind_speed}km/h | Hum. ${
                  currentWeather.humidity
                }% | Temp. ${currentWeather.temp.toFixed(0)}ºC`}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {currentWeather?.weather
                  ? `${currentWeather?.weather[0].main} ● ${currentWeather?.weather[0].description}`
                  : null}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : null}
      </Skeleton>
      <Divider className="weatherCard__divider" />
      {currentAllDays ? <ListNextDays loading={loading} currentAllDays={currentAllDays} /> : null}
    </Card>
  );
}
