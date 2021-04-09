import {isFutureEvent, isExpiredEvent} from './utils.js';

const eventToFilterMap = {
  everything: (events) => events.filter((event) => event.dateFrom).length,
  future: (events) => events.filter((event) => isFutureEvent(event.dateFrom)).length,
  past: (events) => events.filter((event) => isExpiredEvent(event.dateFrom)).length,
};

const generateFilter = (events) => {
  return Object.entries(eventToFilterMap).map(([filterName, countEvents]) => {
    return {
      name: filterName,
      count: countEvents(events),
    };
  });
};

export {generateFilter};
