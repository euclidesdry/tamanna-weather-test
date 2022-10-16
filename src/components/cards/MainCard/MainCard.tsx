import { Divider, Card, Descriptions, Skeleton } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { CurrentType, DailyType, MainCondition } from "../../../@types/weather";
import ReactAnimatedWeather from "react-animated-weather";
import weatherIcon from "../../../helpers/weather-icon";
import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../../../apis/weather";
import { ListNextDays } from "../../ListNextDays";
import React from "react";

const defaults = {
  icon: "CLEAR_DAY",
  color: "goldenrod",
  size: 64,
  animate: true,
};

type MainCardProps = {
  location: { latitude: number; longitude: number };
};

export function MainCard({ location }: MainCardProps) {
  const [currentTimezone, setCurrentTimezone] = React.useState<string | null>(
    null
  );
  const [currentAllDays, setCurrentAllDays] = React.useState<
    DailyType[] | null
  >(null);
  const [currentWeather, setCurrentWeather] =
    React.useState<CurrentType | null>(null);

  const {
    data: weatherQueryResponse,
    isLoading,
    isFetching,
  } = useQuery(["weather"], () =>
    getWeather(location.latitude, location.longitude)
  );

  const loading = isLoading || isFetching;

  React.useEffect(() => {
    if (weatherQueryResponse?.data) {
      setCurrentWeather(weatherQueryResponse.data.current);
      setCurrentTimezone(weatherQueryResponse.data.timezone);
      setCurrentAllDays(weatherQueryResponse.data.daily);
    }
  }, [weatherQueryResponse?.data]);

  const onSelectIcon = (mainCondition: MainCondition) => ({
    ...defaults,
    icon: weatherIcon.icon.select(mainCondition),
  });

  return (
    <Card
      style={{ width: 380, marginTop: 8 }}
      size="small"
      title={currentTimezone}
      actions={[<EditOutlined key="edit" />, <DeleteOutlined key="delete" />]}
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
