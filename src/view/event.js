import dayjs from 'dayjs';
import {getDateFormat,
  getPointDateFromToFormat,
  getEventDateFormat,
  getDuration,
  humanDurationFormat} from '../utils/event.js';
import AbstractView from './abstract.js';

const createTripItemListEventsTemplate = (event) => {
  const {type, offers, isFavorite, dateFrom, dateTo, price, city} = event;
  const favouriteClassName  = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const duration = getDuration(dateFrom, dateTo);

  const humanPointDateFormat = (date) => {
    return dayjs(date).format(getPointDateFromToFormat(dateFrom, dateTo));
  };

  const eventFromDate = getEventDateFormat(dateFrom);
  const travelFromDate = getDateFormat(dateFrom);

  const createNewOffers = () => {
    return offers.map((item) => {
      return `<li class="event__offer">
          <span class="event__offer-title">${item.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </li>`;
    }).join('');
  };

  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${travelFromDate}">${eventFromDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
        </div>
        <h3 class="event__title">${type} ${city}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${humanPointDateFormat(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${humanPointDateFormat(dateTo)}</time>
          </p>
          <p class="event__duration">${humanDurationFormat(duration)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createNewOffers()}
        </ul>
        <button class="${favouriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class Event extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
    this._element = null;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripItemListEventsTemplate(this._events);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
