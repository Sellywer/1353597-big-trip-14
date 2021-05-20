import {getFormDateFormat} from '../utils/event';
import {firstLetterCaps, isArrayEmpty} from '../utils/common.js';
import SmartView from './smart';
import {Mode} from '../utils/const';
import {generatePictures, generateDescription, optionsMap} from '../mock/point-mock';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import flatpickr from 'flatpickr';
// import he from 'he';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const FLATPICKR_SETTINGS = {
  enableTime: true,
  dateFormat: 'd/m/y H:i',
  time_24hr: true,
};


const createDestinationsList = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination}"></option>`;
  }).join('');
};

const createEventTypesListTemplate = (currentType) => {
  const eventTypes = Array.from(optionsMap.keys());

  const eventTypesList = eventTypes.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-type="${type}">${firstLetterCaps(type)}</label>
    </div>`).join('');

  return eventTypesList;
};

const createOffersList = ({type, offers}) => {
  const availableOffers = optionsMap.get(type);

  const offersList = availableOffers.map((offer) => {
    const {title, price, id} = offer;
    const isOfferSelected = offers ? offers.some((item) => item.title === title) : false;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}" data-title="${title}" ${isOfferSelected ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${type}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
      </div>`;
  }).join('');

  return offersList;
};

const createOffersContainer = (state) => {
  return `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">${createOffersList(state)}</div>`;
};

const createEventEditTemplate = (event, destinations) => {
  const {type, destination, dateFrom, dateTo, basePrice} = event;

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

  const hasOptions = isArrayEmpty(optionsMap.get(type));

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
                ${createEventTypesListTemplate(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.city}" list="destination-list-1" required>
          <datalist id="destination-list-1">
            ${createDestinationsList(destinations)}
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price" value="${basePrice}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn event__rollup-btn--close" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${hasOptions ? createOffersContainer(event) : ''}
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
  constructor(event, destinations) {
    super();
    this._data = EditEvent.parseEventToData(event);
    this._mode = Mode;
    this._destinations = destinations;

    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._closeClickHandler  = this._closeClickHandler.bind(this);
    this._routeTypeChangeHandler = this._routeTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offersSelectorClickHandler = this._offersSelectorClickHandler.bind(this);
    this._dateInputHandler = this._dateInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
  }

  getTemplate() {
    return createEventEditTemplate(this._data, this._destinations);
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
    this.getElement()
      .querySelector('.event__available-offers')
      .addEventListener('click', this._offersSelectorClickHandler);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ basePrice: evt.target.value });
  }

  _offersSelectorClickHandler(evt) {
    evt.preventDefault;
    const target = evt.target.closest('input');
    if (!target) {
      return;
    }
    const clickedOption = target.dataset.title;
    const availableOptions = optionsMap.get(this._data.type);
    const eventOffers = this._data.offers;

    const selectedOption = availableOptions.find((item) => item.title === clickedOption);
    const optionToAdd = eventOffers.find((item) => item.title === clickedOption);

    const selectedOptions = optionToAdd ? eventOffers.filter((item) => item.title !== clickedOption) : [...eventOffers, selectedOption];

    this.updateData({
      offers: selectedOptions,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: { city: evt.target.value, description: generateDescription(), pictures: generatePictures() },
    });
  }

  _routeTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({ type: evt.target.value});
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
    if (this._mode === Mode.ADDING) {
      return;
    }

    this._callback.closeClick(EditEvent.parseDataToEvent(this._data));
  }

  static parseEventToData(event) {
    return Object.assign({}, event);
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    return data;
  }
}
