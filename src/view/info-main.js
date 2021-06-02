import {createTotalPrice, getAllTripDates, getRouteEventsTitle} from '../utils/event.js';
import AbstractView from './abstract.js';

const createInfoMainTemplate = (events) => {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getRouteEventsTitle(events)}</h1>

      <p class="trip-info__dates">${getAllTripDates(events)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${createTotalPrice(events)}</span>
    </p>
  </section>`;
};

export default class InfoMain extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createInfoMainTemplate(this._events);
  }
}

