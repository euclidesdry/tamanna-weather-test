export const detect = {
  dayPeriod: (date?: string | number) => {
    const dateToAnalise = parseInt(date?.toString() || '') * 1000;
    const hours = date ? new Date(dateToAnalise).getHours() : new Date().getHours();
    const isDayTime = hours > 6 && hours < 19;

    if (isDayTime === true) {
      return 'DAY';
    }

    return 'NIGHT';
  }
};
