import {createElement, createTotalPrice} from '../utils.js';

const createInfoMainTemplate = (events) => {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${createTotalPrice(events)}</span>
    </p>
  </section>`;
};

export default class InfoMain {
  constructor(events) {
    this._element = null;
    this._events = events;
  }

  getTemplate() {
    return createInfoMainTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

