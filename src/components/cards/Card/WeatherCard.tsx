import { Divider, Card, Descriptions, Skeleton } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import {
  CurrentType,
  DailyType,
  MainCondition,
  WeatherResponseType,
} from "../../../@types/weather";
import ReactAnimatedWeather from "react-animated-weather";
import weatherIcon from "../../../helpers/weather-icon";
import { useQueryClient } from "@tanstack/react-query";
import { getWeather } from "../../../apis/weather";
import { ListNextDays } from "../../ListNextDays";
import React, { ReactNode } from "react";
import { IAPIResponseTemplate } from "../../../@types/api";

const defaults = {
  icon: "CLEAR_DAY",
  color: "goldenrod",
  size: 64,
  animate: true,
};

type WeatherCardProps = {
  cardData?: {
    loading: boolean;
    data: IAPIResponseTemplate<WeatherResponseType> | undefined;
  };
  cardId: number;
  location: { latitude: number; longitude: number };
  onAddNewCard: () => void;
};

export function WeatherCard({
  cardId,
  location,
  onAddNewCard,
}: WeatherCardProps) {
  const [weatherQueryResponse, setWeatherQueryResponse] =
    React.useState<IAPIResponseTemplate<WeatherResponseType>>();
  const [currentTimezone, setCurrentTimezone] = React.useState<string | null>(
    null
  );
  const [currentAllDays, setCurrentAllDays] = React.useState<
    DailyType[] | null
  >(null);
  const [currentWeather, setCurrentWeather] =
    React.useState<CurrentType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const queryClient = useQueryClient();
  const queryStatus = queryClient.getQueryState(["weatherCard-query"]);

  React.useEffect(() => {
    setIsLoading(queryStatus?.status === "loading");
  }, [queryStatus]);

  React.useEffect(() => {
    (async function () {
      await queryClient.prefetchQuery(
        ["weatherCard-query"],
        () => getWeather(location.latitude, location.longitude),
        {
          staleTime: 240000,
        }
      );

      const queryData = queryClient.getQueryData<
        IAPIResponseTemplate<WeatherResponseType>
      >(["weatherCard-query"]);

      console.log(" ---::: queryData []: ", queryData?.data);

      setWeatherQueryResponse(queryData);
    })();
  }, []);

  const loading = isLoading;

  const onSelectIcon = (mainCondition: MainCondition) => ({
    ...defaults,
    icon: weatherIcon.icon.select(mainCondition),
  });

  const handleAddLocation = () => {
    onAddNewCard();
    console.log("☪ New Coordinates has been added!!");
  };

  const configActions = (): ReactNode[] => [
    <EditOutlined key="edit" />,
    <DeleteOutlined key="delete" />,
    <PlusOutlined key="add" onClick={() => handleAddLocation()} />,
  ];

  React.useEffect(() => {
    if (weatherQueryResponse?.data) {
      setCurrentWeather(weatherQueryResponse.data.current);
      setCurrentTimezone(weatherQueryResponse.data.timezone);
      setCurrentAllDays(weatherQueryResponse.data.daily);
    }
  }, [weatherQueryResponse?.data]);

  return (
    <Card
      style={{ width: 380, marginTop: 8 }}
      size="small"
      title={currentTimezone}
      actions={configActions()}
    >
      <Skeleton loading={loading} avatar active>
        {currentWeather?.weather ? (
          <>
            <ReactAnimatedWeather
              {...onSelectIcon(currentWeather?.weather[0].main)}
            />
            <Descriptions
              title={`Today, ${format(
                new Date(currentWeather?.dt * 1000),
                "LLLL do, yyyy"
              )}`}
              size="small"
              column={1}
            >
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
      <Divider style={{ marginTop: "8px", marginBottom: "8px" }} />
      {currentAllDays ? (
        <ListNextDays loading={loading} currentAllDays={currentAllDays} />
      ) : null}
    </Card>
  );
}