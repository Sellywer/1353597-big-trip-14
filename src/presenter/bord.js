import EventsBoardView from '../view/trip-events-board';
import TripListView from '../view/trip-list';
import SortView from '../view/sort';
import NoEventView from '../view/no-event';
import NewEventView from '../view/new-event';

import EventPresenter from './events';

import {updateItem} from '../utils/common';
import {render, RenderPosition} from '../utils/render';

export default class BoardPresenter  {
  constructor(boardContainer) {
    this._boardContainer  = boardContainer;
    this._eventPresenter = {};

    this._boardComponent = new EventsBoardView();
    this._sortComponent = new SortView();
    this._tripListComponent = new TripListView();
    this._noEventComponent = new NoEventView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(boardEvents) {
    this._boardEvents = boardEvents.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._tripListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
    this._renderNewEvents(boardEvents);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._boardEvents = updateItem(this._boardEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
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
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
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
