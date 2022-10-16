import { List } from "antd";
import { format } from "date-fns";
import { DailyType } from "../../@types/weather";

type MainCardProps = {
  currentAllDays: DailyType[];
  loading: boolean;
};

export function ListNextDays({ currentAllDays, loading }: MainCardProps) {
  return (
    <List
      loading={loading}
      size="small"
      dataSource={currentAllDays.filter((day, index) => index !== 0)}
      renderItem={(item) => (
        <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
          <strong>{format(new Date(item?.dt * 1000), "MMM do")}</strong>
          {`, ${item.humidity}% | Min. ${item.temp.min.toFixed(
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
  );
}
