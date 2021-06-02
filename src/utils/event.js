import dayjs from 'dayjs';
import {getRandomInteger} from './common';

export const MILLISECONDS = 1000;
const MAX_MONTHS_GAP = 6;
const MIN_DAYS_GAP = -10;
const MAX_DAYS_GAP = 7;
const MIN_DAYSTO_GAP = 1;
const DAYS = 30;
const HOURS = 24;
const MIN_MINUTES = 10;
const MAX_MINUTES = 60;
const TEN_MINUTES = 10;
const FIRST_POINT_INDEX = 0;
const QUANTITY_POINT = 1;
const MIN_TITLE_LENGTH = 3;

export const getDuration = (dateFrom, dateTo) => {
  const startTime = new Date(dateFrom).getTime();
  const endTime = new Date(dateTo).getTime();
  const duration = endTime - startTime;
  return duration;
};

export const humanDurationFormat = (duration) => {
  let minutes = Math.floor((duration / (MILLISECONDS * MAX_MINUTES)) % MAX_MINUTES);
  let hours = Math.floor((duration / (MILLISECONDS * MAX_MINUTES * MAX_MINUTES)) % HOURS);
  let days = Math.floor((duration / (MILLISECONDS * MAX_MINUTES * MAX_MINUTES * HOURS)) % DAYS);

  days = (days < TEN_MINUTES) ? '0' + days : days;
  hours = (hours < TEN_MINUTES) ? '0' + hours : hours;
  minutes = (minutes < TEN_MINUTES) ? '0' + minutes : minutes;

  if (days !== '00') {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (days === '00' && hours !== '00') {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

const humanizeDuration = (minuteDuration, hoursDuration, daysDuration) => {
  const huminizedDays = daysDuration < MIN_MINUTES ? '0' + daysDuration : daysDuration;
  const humanizedHours = (hoursDuration - daysDuration * HOURS) < MIN_MINUTES ? '0' + (hoursDuration - daysDuration * HOURS) : hoursDuration - daysDuration * HOURS;
  const humanizedMinutes = (minuteDuration - hoursDuration * MAX_MINUTES) < MIN_MINUTES ? '0' + (minuteDuration - hoursDuration * MAX_MINUTES) : minuteDuration -hoursDuration * MAX_MINUTES;

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
  const hoursDuration = Math.floor(duration / MAX_MINUTES);
  const daysDuration =  Math.floor(hoursDuration /HOURS);

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
  }
  return 'HH:mm';
};

export const getDateFrom = () => {
  const dateFrom = dayjs()
    .add(getRandomInteger(0, MAX_MONTHS_GAP), 'M')
    .add(getRandomInteger(MIN_DAYS_GAP, MAX_DAYS_GAP), 'd')
    .add(getRandomInteger(0, HOURS), 'h')
    .add(getRandomInteger(0, MAX_MINUTES), 'm')
    .format('YYYY-MM-DDTHH:mm');
  return dateFrom;
};

export const getDateTo = (dateFrom) => {
  const dateTo = dayjs(dateFrom)
    .add(getRandomInteger(0, MIN_DAYSTO_GAP), 'd')
    .add(getRandomInteger(0, HOURS), 'h')
    .add(getRandomInteger(MIN_MINUTES, MAX_MINUTES), 'm')
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
  events.forEach((item) => {
    price += +item.basePrice;

    item.offers.forEach((item) => {
      price += item.price;
    });
  });
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
    return `${routeTitle.slice(FIRST_POINT_INDEX, QUANTITY_POINT).join(' &mdash; ')}
    &mdash; . . . &mdash; ${lastEvent.join(' &mdash; ')}`;
  }
  return routeTitle.join(' &mdash; ');
};
