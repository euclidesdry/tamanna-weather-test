import { useState, useEffect } from "react";
import "./App.css";
import {
  Divider,
  Card,
  List,
  Switch,
  Descriptions,
  Skeleton,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { useGeolocation } from "react-use";
import { useCurrentPosition } from "react-use-geolocation";
import { getWeather } from "./apis/weather";
import { CurrentType, DailyType, MainCondition } from "./types/weather";
import { IconType } from "./types/cloud-icons";
import weatherIcon from "./helpers/weather-icon";
import { useQuery } from "@tanstack/react-query";
import { MainCard } from "./components/cards/MainCard";

const { Meta } = Card;

const data = [
  {
    title: "Tempo dia 1",
  },
  {
    title: "Tempo dia 2",
  },
  {
    title: "Tempo dia 3",
  },
  {
    title: "Tempo dia 4",
  },
  {
    title: "Tempo dia 5",
  },
  {
    title: "Tempo dia 6",
  },
  {
    title: "Tempo dia 7",
  },
  {
    title: "Tempo dia 8",
  },
  {
    title: "Tempo dia 9",
  },
  {
    title: "Tempo dia 10",
  },
];

function App() {
  // const state = useGeolocation();
  const [position, error] = useCurrentPosition();
  const [currentTimezone, setCurrentTimezone] = useState<string | null>(null);
  const [currentAllDays, setCurrentAllDays] = useState<DailyType[] | null>(
    null
  );
  const [currentWeather, setCurrentWeather] = useState<CurrentType | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
  };

  // if (!position) {
  //   message.warn(
  //     "Geolocation is not available on this device. To connect it you'll need to activate it"
  //   );
  // }

  useEffect(() => {
    console.log(" 🌐 Geolocation API", position, error);

    const latitude = position?.coords?.latitude as number | undefined;
    const longitude = position?.coords?.longitude as number | undefined;

    if (latitude && longitude) {
      (async function () {
        setLoading(true);
        try {
          const response = await getWeather(latitude, longitude);

          console.log(
            " ---:::GetWeather: ",
            response.data.current,
            response.data
          );

          setCurrentWeather(response.data.current);
          setCurrentTimezone(response.data.timezone);
          setCurrentAllDays(response.data.daily);
        } catch (e) {
          console.warn("🙄 Something is going wrong: ", e);
        } finally {
          setLoading(false);
        }
      })();
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
        <Switch checked={!loading} onChange={onChange} />
        {position ? (
          <MainCard
            currentAllDays={currentAllDays}
            currentTimezone={currentTimezone}
            currentWeather={currentWeather}
            location={{
              latitude: position?.coords?.latitude as number,
              longitude: position?.coords?.longitude as number,
            }}
            loading={loading}
          />
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
