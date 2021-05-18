import EventsBoardView from '../view/trip-events-board';
import TripListView from '../view/trip-list';
import SortView from '../view/sort';
import NoEventView from '../view/no-event';
import NewEventView from '../view/new-event';

import EventPresenter from './events';
import {filter} from '../utils/filter';

import {render, RenderPosition, remove} from '../utils/render';
import {UpdateType, UserAction} from '../utils/const';
import {sortByTime, sortByPrice, sortByDate} from '../utils/event';
import {SortType} from '../utils/const';

export default class BoardPresenter  {
  constructor(boardContainer, eventsModel, filterModel) {
    this._boardContainer  = boardContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._sortComponent = null;

    this._boardComponent = new EventsBoardView();
    this._tripListComponent = new TripListView();
    this._noEventComponent = new NoEventView();
    this._newEventComponent = new NewEventView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._tripListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
    // this._renderNewEvents(boardEvents);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;

    this._clearBoard();
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DEFAULT:
        return filtredEvents.sort(sortByDate);
      case SortType.TIME:
        return filtredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filtredEvents.sort(sortByPrice);
    }

    return filtredEvents;
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this._tripListComponent,
      this._handleViewAction,
      this._handleModeChange,
    );

    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._getEvents().map((item) => this._renderEvent(item));
  }

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._noEventComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderNoEvents() {
    render(this._boardComponent, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderNewEvents() {
    render(this._tripListComponent, this._newEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    if (this._getEvents().length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._renderEvents();
  }
}
