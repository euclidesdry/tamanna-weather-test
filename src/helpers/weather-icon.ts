import { IconType } from '../@types/cloud-icons';
import { MainCondition } from '../@types/weather';

export default {
  icon: {
    select: (mainCondition: MainCondition, description?: string): IconType => {
      switch (mainCondition) {
        case 'Rain':
          return 'RAIN';
        case 'Clouds':
          return 'PARTLY_CLOUDY_DAY';
        case 'Snow':
          return 'SNOW';
        case 'Clear':
          return 'CLEAR_DAY';
        case 'Thunderstorm':
          return 'CLOUDY';
        case 'Atmosphere':
          return 'FOG';
        default:
          return 'CLEAR_DAY';
      }
    }
  }
};
