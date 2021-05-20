import {isFutureEvent, isExpiredEvent} from './event';
import {FilterType} from './const';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureEvent(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isExpiredEvent(event)),
};

