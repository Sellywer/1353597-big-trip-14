import EventEditView from '../view/edit-event';
import {nanoid} from 'nanoid';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType} from '../utils/const';

export default class EventNew {
  constructor(eventListContainer, changeData) {

    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteEditClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {

    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new EventEditView();

    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {

    if (this._eventEditComponent !== null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

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
      Object.assign({}, event, {id: nanoid()} ),
    );
    this.destroy();
  }
}
