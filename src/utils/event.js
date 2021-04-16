import dayjs from 'dayjs';
import {getRandomInteger} from './common';

const MAX_MONTHS_GAP = 6;
const MIN_DAYS_GAP = -10;
const MAX_DAYS_GAP = 7;
const MIN_DAYSTO_GAP = 1;
const HOURS_GAP = 24;
const MIN_MINUTES_GAP = 10;
const MAX_MINUTES_GAP = 60;

export const getDuration = (dateFrom, dateTo) => {
  const startTime = new Date(dateFrom).getTime();
  const endTime = new Date(dateTo).getTime();
  const duration = endTime - startTime;
  return duration;
};

export const humanDurationFormat = (duration) => {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 30);

  days = (days < 10) ? '0' + days : days;
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;

  if (days !== '00') {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (days === '00' && hours !== '00') {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
};

export const isEventFrom = (event) => {
  return dayjs().isAfter(event, 'D');
};

export const isEventTo = (event) => {
  return dayjs().isBefore(event, 'D');
};

export const getPointDateFromToFormat = (dateFrom, dateTo) => {
  dateFrom = new Date(dateFrom).getDate();
  dateTo = new Date(dateTo).getDate();

  if (dateTo - dateFrom >= 1) {
    return 'MM/D HH:mm';
  } else {
    return 'HH:mm';
  }
};

export const getDateFrom = () => {
  const dateFrom = dayjs()
    .add(getRandomInteger(0, MAX_MONTHS_GAP), 'M')
    .add(getRandomInteger(MIN_DAYS_GAP, MAX_DAYS_GAP), 'd')
    .add(getRandomInteger(0, HOURS_GAP), 'h')
    .add(getRandomInteger(0, MAX_MINUTES_GAP), 'm')
    .format('YYYY-MM-DDTHH:mm');

  return dateFrom;
};

export const getDateTo = (dateFrom) => {
  const dateTo = dayjs(dateFrom)
    .add(getRandomInteger(0, MIN_DAYSTO_GAP), 'd')
    .add(getRandomInteger(0, HOURS_GAP), 'h')
    .add(getRandomInteger(MIN_MINUTES_GAP, MAX_MINUTES_GAP), 'm')
    .format('YYYY-MM-DDTHH:mm');

  return dateTo;
};

export const getTripDates = (points) => {
  const firstPoint = points[0];
  const lastIndex = points.length - 1;
  const lastPoint = points[lastIndex];
  const startingMonth = dayjs(firstPoint.dateFrom).month();
  const endingMonth = dayjs(lastPoint.dateTo).month();

  if (startingMonth === endingMonth) {
    return `${getEventDateFormat(firstPoint.dateFrom)} &mdash; ${getDayFormat(lastPoint.dateTo)}`;
  }
  return `${getEventDateFormat(firstPoint.dateFrom)} &mdash; ${getEventDateFormat(lastPoint.dateTo)}`;
};

export const getDateFormat = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const getEventDateFormat = (date) => {
  return dayjs(date).format('MMM DD');
};

export const getFormDateFormat = (date) => {
  return dayjs(date).format('YY/MM/DD HH:mm');
};

export const getDayFormat = (date) => {
  return dayjs(date).format('DD');
};

export const isFutureEvent = (point) => {
  return dayjs(point.dateFrom).isAfter(dayjs(), 'd') || dayjs(point.dateFrom).isSame(dayjs(), 'D');
};

export const isExpiredEvent = (point) => {
  return dayjs(point.dateTo).isBefore(dayjs(), 'd');
};

export const createTotalPrice = (events) => {
  let price = 0;
  events.forEach((item) => price += item.price);
  return price;
};
