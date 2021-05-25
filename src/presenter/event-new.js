import EventEditView from '../view/new-event';
import {nanoid} from 'nanoid';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType} from '../utils/const';


const BLANK_EVENT = {
  dateFrom: new Date(),
  dateTo: new Date(),
  isFavorite: false,
  type: 'taxi',
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  offers: [],
  basePrice: '',
};

export default class EventNew {
  constructor(eventListContainer, changeData, offersModel, destinationsModel) {

    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventNewComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {

    if (this._eventNewComponent !== null) {
      return;
    }

    this._eventNewComponent = new EventEditView(BLANK_EVENT, this._offersModel.getOffers(), this._destinationsModel.getDestinations());

    this._eventNewComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventNewComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventNewComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventNewComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._eventNewComponent);
    this._eventNewComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()},event),
    );
    this.destroy();
  }
}