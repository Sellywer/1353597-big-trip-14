import {isFutureEvent, isExpiredEvent} from '../utils/event';

const eventToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events.filter((event) => isFutureEvent(event)).length,
  past: (events) => events.filter((event) => isExpiredEvent(event)).length,

};

export const generateFilter = (events) => {
  return Object.entries(eventToFilterMap).map(([filterName, countEvents]) => {
    return {
      name: filterName,
      count: countEvents(events),
    };
  });
};
