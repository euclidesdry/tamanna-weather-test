import { IconType } from '../@types/cloud-icons';
import { MainCondition } from '../@types/weather';
import { detect } from './detect';

export default {
  icon: {
    select: (mainCondition: MainCondition, date?: string | number): IconType => {
      switch (mainCondition) {
        case 'Rain':
          return 'RAIN';
        case 'Clouds':
          return `PARTLY_CLOUDY_${detect.dayPeriod(date)}`;
        case 'Snow':
          return 'SNOW';
        case 'Clear':
          return `CLEAR_${detect.dayPeriod(date)}`;
        case 'Thunderstorm':
          return 'CLOUDY';
        case 'Atmosphere':
          return 'FOG';
        default:
          return `CLEAR_${detect.dayPeriod(date)}`;
      }
    }
  }
};
