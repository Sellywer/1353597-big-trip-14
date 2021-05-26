import dayjs from 'dayjs';
import {getRandomInteger} from './common';

const MAX_MONTHS_GAP = 6;
const MIN_DAYS_GAP = -10;
const MAX_DAYS_GAP = 7;
const MIN_DAYSTO_GAP = 1;
const HOURS_GAP = 24;
const MIN_MINUTES_GAP = 10;
const MAX_MINUTES_GAP = 60;
const MIN_TITLE_LENGTH = 3;

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

const humanizeDuration = (minuteDuration, hoursDuration, daysDuration) => {
  const huminizedDays = daysDuration < 10 ? '0' + daysDuration : daysDuration;
  const humanizedHours = (hoursDuration - daysDuration * 24) < 10 ? '0' + (hoursDuration - daysDuration * 24) : hoursDuration - daysDuration * 24;
  const humanizedMinutes = (minuteDuration - hoursDuration * 60) < 10 ? '0' + (minuteDuration - hoursDuration * 60) : minuteDuration -hoursDuration * 60;

  if (daysDuration > 0) {
    return `${huminizedDays}D ${humanizedHours}H ${humanizedMinutes}M`;
  }

  if (daysDuration === 0 && hoursDuration !== 0) {
    return `${humanizedHours}H ${humanizedMinutes}M`;
  }

  return `${humanizedMinutes}M`;
};

export const humanizeTotalDuration = (duration) => {
  const minuteDuration = duration;
  const hoursDuration = Math.floor(duration / 60);
  const daysDuration =  Math.floor(hoursDuration /24);

  return humanizeDuration(minuteDuration, hoursDuration, daysDuration);
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

export const getDateFormat = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const getEventDateFormat = (date) => {
  return dayjs(date).format('MMM DD');
};

export const getFormDateFormat = (date) => {
  return dayjs(date).format('DD/MM/YY HH:MM');
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
  events.forEach((item) => price += item.basePrice);
  return price;
};

export const sortByTime = (eventA, eventB) => {
  const firstDuration = getDuration(eventA.dateFrom, eventA.dateTo);
  const secondDuration = getDuration(eventB.dateFrom, eventB.dateTo);

  return secondDuration - firstDuration;
};

export const sortByPrice = (priceA, priceB) => {
  return priceB.basePrice - priceA.basePrice;
};

export const sortByDate = (pointA, pointB) => {
  return dayjs(pointA.dateFrom).diff(pointB.dateTo);
};

export const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};

export const getAllTripDates = (events) => {
  const firstEvent = events[0];
  const lastIndex = events.length - 1;
  const lastEvent = events[lastIndex];
  const startingMonth = dayjs(firstEvent.dateFrom).month();
  const endingMonth = dayjs(lastEvent.dateTo).month();
  const start = getEventDateFormat(firstEvent.dateFrom);
  const end = startingMonth === endingMonth ? getDayFormat(lastEvent.dateTo) : getEventDateFormat(lastEvent.dateTo);

  return `${start} &mdash; ${end}`;
};

const removeDuplEventsNames = (events) => {
  const unduplicatedEventsNames = [events[0].destination.name];

  for (let i = 0; i < events.length - 1; i++) {
    const current = events[i].destination.name;
    const next = events[i + 1].destination.name;

    if (next !== current) {
      unduplicatedEventsNames.push(next);
    }
  }
  return unduplicatedEventsNames;
};

export const getRouteEventsTitle = (events) => {
  const routeTitle = removeDuplEventsNames(events);
  const lastEvent = routeTitle.slice([routeTitle.length - 1]);

  if (routeTitle.length > MIN_TITLE_LENGTH) {
    return `${routeTitle.slice(0, MIN_TITLE_LENGTH - 1).join(' &mdash; ')}
    &mdash; . . . &mdash; ${lastEvent.join(' &mdash; ')}`;
  }
  return routeTitle.join(' &mdash; ');
};
