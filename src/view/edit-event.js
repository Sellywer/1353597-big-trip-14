import {getFormDateFormat} from '../utils/event';
import SmartView from './smart';
import {generatePictures, generateOffers, generateDescription} from '../mock/point-mock';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const FLATPICKR_SETTINGS = {
  enableTime: true,
  dateFormat: 'd/m/y H:i',
  time_24hr: true,
};


const BLANK_EVENT = {
  dateFrom: new Date(),
  dateTo: new Date(),
  isFavorite: false,
  type: 'taxi',
  destination: {
    city: '',
    description: '',
    pictures: [],
  },
  offers: [
    {
      title: 'Choose seats',
      price: 5,
    },
    {
      title: 'Switch to comfort class',
      price: 100,
    },
  ],
  basePrice: '',
};

const createEventEditTemplate = (event) => {
  const {type, destination, offers, dateFrom, dateTo, basePrice} = event;

  const offersContainerClassName = offers.length !== 0 ? '' : ' visually-hidden';

  const createEventOfferSelectors = (offers) => {
    return offers.map((item) => {
      const checked = item.isChecked ? 'checked' : '';
      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.title}" type="checkbox" name="event-offer-${item.title}" ${checked}>
          <label class="event__offer-label" for="event-offer-${item.title}">
            <span class="event__offer-title">${item.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
          </label>
      </div>`;
    }).join('');
  };

  const createPictureMarkup = (pictures) => {
    return pictures
      .map((item) => {
        return `<img class="event__photo" src="${item.src}" alt="${item.description}">`;
      })
      .join(' ');
  };

  const createPictureContainerMarkup = (pictures) => {
    if (pictures.length) {
      return `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createPictureMarkup(pictures)}
      </div>
    </div>`;
    }

    return '';
  };
  const travelFromDate = getFormDateFormat(dateFrom);
  const travelToDate = getFormDateFormat(dateTo);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === 'taxi' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${type === 'transport' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing"  ${type === 'sightseeing' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.city}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${travelFromDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${travelToDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn event__rollup-btn--close" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers ${offersContainerClassName}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createEventOfferSelectors(offers)}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
        </section>
        ${createPictureContainerMarkup(destination.pictures)}
      </section>
    </form>
  </li>`;
};

export default class EditEvent extends SmartView  {
  constructor(event = BLANK_EVENT ) {
    super();
    this._data = EditEvent.parseEventToData(event);
    this._element = null;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeClickHandler  = this._closeClickHandler.bind(this);
    this._routeTypeChangeHandler = this._routeTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateInputHandler = this._dateInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn--close').addEventListener('click', this._closeClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this._setDateFromPicker();
    this._setDateToPicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(event) {
    this.updateData(EditEvent.parseEventToData(event));
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._routeTypeChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
    this.getElement()
      .querySelector('#event-start-time-1')
      .addEventListener('change', this._dateInputHandler);
    this.getElement()
      .querySelector('#event-end-time-1')
      .addEventListener('change', this._dateInputHandler);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ basePrice: evt.target.value });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: { city: evt.target.value, description: generateDescription(), pictures: generatePictures() },
    });
  }

  _routeTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ type: evt.target.value, offers: generateOffers() });
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      Object.assign({},
        FLATPICKR_SETTINGS,
        {
          defaultDate: this._data.dateFrom,
          onChange: this._dateFromChangeHandler,
        }),
    );
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      Object.assign({},
        FLATPICKR_SETTINGS,
        {
          minDate: this._data.dateFrom,
          defaultDate: this._data.dateTo,
          onChange: this._dateToChangeHandler,
        }),
    );
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _dateInputHandler(evt) {
    evt.preventDefault();
    dayjs.extend(customParseFormat);
    const formatedData = dayjs(evt.target.value, 'DD/MM/YY HH:mm');
    if (evt.target.id === 'event-start-time-1') {
      this.updateData({
        dateFrom: dayjs(formatedData).toDate(),
      });
    }
    if (evt.target.id === 'event-end-time-1') {
      this.updateData({
        dateTo: dayjs(formatedData).toDate(),
      });
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditEvent.parseDataToEvent(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditEvent.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  static parseEventToData(event) {
    return Object.assign({}, event);
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    return data;
  }
}
