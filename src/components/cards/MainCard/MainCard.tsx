import React, { useState, useEffect } from "react";
import { Divider, Card, List, Descriptions, Skeleton } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { CurrentType, DailyType, MainCondition } from "../../../types/weather";
import ReactAnimatedWeather from "react-animated-weather";
import weatherIcon from "../../../helpers/weather-icon";
import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../../../apis/weather";

const defaults = {
  icon: "CLEAR_DAY",
  color: "goldenrod",
  size: 64,
  animate: true,
};

type MainCardProps = {
  currentWeather: CurrentType | null;
  currentTimezone: string | null;
  currentAllDays: DailyType[] | null;
  location: { latitude: number; longitude: number };
  loading: boolean;
};

export function MainCard({
  currentTimezone,
  currentWeather,
  currentAllDays,
  location,
  loading,
}: MainCardProps) {
  const { data, isLoading } = useQuery(["weather"], () =>
    getWeather(location.latitude, location.longitude)
  );

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
                  ? currentWeather?.weather[0].description
                  : null}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : null}
      </Skeleton>
      <Divider style={{ marginTop: "8px", marginBottom: "8px" }} />
      {currentAllDays ? (
        <List
          loading={loading || isLoading}
          size="small"
          dataSource={currentAllDays.filter((day, index) => index !== 0)}
          renderItem={(item) => (
            <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
              {`${format(new Date(item?.dt * 1000), "MMM do")}, ${
                item.humidity
              }% | Min. ${item.temp.min.toFixed(
                0
              )}ºC * Max. ${item.temp.max.toFixed(0)}ºC | ${
                item.weather[0].main
              } ● `}
              <img
                // http://openweathermap.org/img/wn/10d@2x.png
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
                height={32}
                title={item.weather[0].description}
              />
            </List.Item>
          )}
        />
      ) : null}
    </Card>
  );
}
