import EventView from '../view/event';
import EventEditView from '../view/edit-event';

import {render, RenderPosition, replace, remove} from '../utils/render';
import {UserAction, UpdateType, Mode, State, OfflineMessage} from '../utils/const';
import {isDatesEqual} from '../utils/event';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast.js';

export default class Event {
  constructor(eventListContainer, changeData, changeMode, offers, destinations) {

    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offers = offers;
    this._destinations = destinations;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    // из edit в event
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleEventClick = this._handleEventClick.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._handleDeleteEditClick = this._handleDeleteEditClick.bind(this);
  }

  init(event, offers, destinations) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EventEditView(this._event, offers, destinations);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setCloseClickHandler(this._handleEventClick);

    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteEditClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast(OfflineMessage.EDIT_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    this._replaceCardToForm();
  }

  _handleEventClick() {
    this._eventEditComponent.reset(this._event);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast(OfflineMessage.SAVE_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    const isMinorUpdate =
    !isDatesEqual(this._event.dateFrom, update.dateFrom) ||
    this._event.basePrice !== update.basePrice;

    this._changeData(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  _handleDeleteEditClick(event) {
    if (!isOnline()) {
      toast(OfflineMessage.DELETE_EVENT);
      this.setViewState(State.ABORTING);
      return;
    }

    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }
}

export { State };
