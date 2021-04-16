import SiteMenuView from './view/site-menu-view';
import InfoMainView from './view/info-main-view';
import FiltersView from './view/filters-view';
import SortView from './view/sort-view';
import TripListView from './view/trip-list-view';
import EditEventView from './view/edit-event-view';
import EventView from './view/event-view';
import NewEventView  from './view/new-event-view';
import NoEventView from './view/no-event-view.js';
import {generatePoint} from './mock/point-mock';
import {generateFilter} from './filters';
import {render, RenderPosition} from './utils';

const TRIP_EVENTS_COUNT = 15;

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
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


// Навигация, сортировка, главная информация по стоимости и направлению
render(siteMainElement, new InfoMainView(events).getElement(), RenderPosition.AFTERBEGIN);
render(siteFilterElement, new FiltersView(filters).getElement(),  RenderPosition.BEFOREEND);

// render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);

// trip-list

render(tripEventsElement, new TripListView().getElement(), RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

// пробуем
const renderEventsListElement = (pointsContainer, events) => {

  if (events.length === 0) {
    render(pointsContainer, new NoEventView().getElement(), RenderPosition.AFTERBEGIN);
  }

  if (events.length > 0) {
    render(pointsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);
    render(pointsContainer, new NewEventView(events[0]).getElement(), RenderPosition.BEFOREEND);
  }

  render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN); // готово

  events.forEach((event) => {
    renderEvent(pointsContainer, event);
  });
};

renderEventsListElement(tripEventsListElement, events);
