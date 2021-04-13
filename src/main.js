import SiteMenuView from './view/navigation';
import InfoMainView from './view/trip-main';
import FiltersView from './view/trip-filters.js';

import SortingView from './view/trip-sort';

import TripListView from './view/trip-list';
import EditEventView from './view/event-edit';
import EventView from './view/event-item';
import NewEventView  from './view/event-new';
import NoEventView from './view/no-event.js';

import {generatePoint} from './mock/point-mock';
import {generateFilter} from './filters.js';

import {render, RenderPosition} from './utils.js';

const TRIP_EVENTS_COUNT = 15;
const EMPTY_EVENTS_LIST = 0;

const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const events = new Array(TRIP_EVENTS_COUNT).fill().map(generatePoint);

const filters = generateFilter(events);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EditEventView(event);

  const replaceCardToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToCard = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });

  eventEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


// // Навигация, сортировка, главная информация по стоимости и направлению
render(siteMainElement, new InfoMainView(events).getElement(), RenderPosition.AFTERBEGIN);

render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(siteFilterElement, new FiltersView(filters).getElement(),  RenderPosition.BEFOREEND);


// // trip-list

render(tripEventsElement, new TripListView().getElement(), RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

if (events.length === EMPTY_EVENTS_LIST) {
  render(tripEventsListElement, new NoEventView().getElement(), RenderPosition.AFTERBEGIN);
}

if (events.length > EMPTY_EVENTS_LIST) {
  render(tripEventsElement, new SortingView().getElement(), RenderPosition.AFTERBEGIN);
  render(tripEventsListElement, new NewEventView(events[0]).getElement(), RenderPosition.BEFOREEND);
}

for (let i = 1; i < TRIP_EVENTS_COUNT; i++) {
  renderEvent(tripEventsListElement, events[i]);
}
