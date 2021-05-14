import EventsBoardView from '../view/trip-events-board';
import TripListView from '../view/trip-list';
import SortView from '../view/sort';
import NoEventView from '../view/no-event';
import NewEventView from '../view/new-event';

import EventPresenter from './events';

import {updateItem} from '../utils/common';
import {render, RenderPosition} from '../utils/render';
import { sortByTime, sortByPrice, sortByDate } from '../utils/event';
import { SortType } from '../utils/const';

export default class BoardPresenter  {
  constructor(boardContainer, eventsModel) {
    this._boardContainer  = boardContainer;
    this._eventsModel = eventsModel;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new EventsBoardView();
    this._tripListComponent = new TripListView();
    this._noEventComponent = new NoEventView();
    this._sortComponent = new SortView(SortType.DEFAULT);

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardEvents) {
    this._boardEvents = boardEvents.slice();
    this._sourcedBoardEvents = boardEvents.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._tripListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
    // this._renderNewEvents(boardEvents);
  }

  _handleEventChange(updatedEvent) {
    this._boardEvents = updateItem(this._boardEvents, updatedEvent);
    this._sourcedBoardEvents = updateItem(this._sourcedBoardEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
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
    this._sortEvents(sortType);

    this._clearEvents();
    this._renderEvents();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._sortEvents();
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._boardEvents.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._boardEvents.sort(sortByPrice);
        break;
      default:
        this._boardEvents.sort(sortByDate);
    }

    if (sortType !== undefined) {
      this._currentSortType = sortType;
    }
  }

  _getEvents() {
    return this._eventsModel.getEvents();
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this._tripListComponent,
      this._handleEventChange,
      this._handleModeChange,
    );

    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(from, to) {
    this._boardEvents
      .slice(from, to)
      .forEach((event) => this._renderEvent(event));
  }

  _clearEvents() {
    Object.values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _renderNoEvents() {
    render(this._boardComponent, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderNewEvents(event) {
    const newEventsComponent = new NewEventView(event);
    render(this._tripListComponent, newEventsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    if (this._boardEvents.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._renderEvents();
  }
}
