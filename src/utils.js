import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (elements) =>  elements[Math.floor(Math.random() * elements.length)];

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const getRandomArray = (array, min, max) => {

  shuffle(array);

  const arrayLength = getRandomInteger(min, max);

  const newArray = [];
  for (let i = 0; i < arrayLength; i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

// Генерация даты и времени

export const generateDate = () => {
  const maxDaysGap = 31;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const day = dayjs().add(daysGap, 'day').toDate();
  return dayjs(day);
};

export const generateTime = () => {
  const minute = getRandomInteger(1, 60);
  const hour = getRandomInteger(1, 24);
  const item = dayjs().add(minute, 'm').add(hour, 'hour').toDate();
  return dayjs(item);
};

export const humanTimeFormat = (time) => {
  return dayjs(time).format('HH:mm');
};

export const humanDateFormat = (data) => {
  return dayjs(data).format('D MMMM');
};

export const changeDateFormat = (date) => {
  return dayjs(date).format('D/MM/YY');
};

export const formatMilliseconds = (duration) => {
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  let days = parseInt((duration / (1000 * 60 * 60 * 24)) % 30);

  days = (days < 10) ? '' + days : days;
  hours = (hours < 10) ? '' + hours : hours;
  minutes = (minutes < 10) ? '' + minutes : minutes;

  if (days === '0') {
    return hours + 'H:' + minutes;
  }
  if (days === '0' && hours === '0') {
    return minutes;
  }

  return days + 'D:' + hours + 'H:' + minutes;
};

export const isEventComing = (event) => {
  return dayjs().isAfter(event, 'D');
};

export const isEventExpired = (event) => {
  return dayjs().isBefore(event, 'D');
};
