import SiteMenuView from './view/navigation';
import {createInfoMainTemplate} from './view/trip-main.js';

import {createFiltersTemplate} from './view/trip-filters.js';

// import {createSortTemplate} from './view/trip-sort.js';
import SortingView from './view/trip-sort';
import {createTripListTemplate} from './view/trip-list.js';

import {createTripItemListEditTemplate} from './view/trip-item-list-edit.js';
import {createNewEventTemplate} from './view/new-event.js';
import {createTripItemListEventsTemplate} from './view/trip-item.js';
import {generatePoint} from './mock/point-mock';
import {generateFilter} from './filters.js';
import {renderTemplate, renderElement, RenderPosition} from './utils.js';

const TRIP_EVENTS_COUNT = 10;

const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const events = new Array(TRIP_EVENTS_COUNT).fill().map(generatePoint);

const filters = generateFilter(events);

// Навигация, сортировка, главная информация по стоимости и напрвлению

renderElement(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

renderTemplate(siteFilterElement, createFiltersTemplate(filters), 'beforeend');
renderTemplate(siteMainElement, createInfoMainTemplate(events), 'afterbegin');
// renderTemplate(siteMainElement, new InfoMainView().getElement(), RenderPosition.AFTERBEGIN);

// Сортировка

renderElement(tripEventsElement, new SortingView().getElement(), RenderPosition.AFTERBEGIN);

// trip-list

renderTemplate(tripEventsElement, createTripListTemplate(), 'beforeend');

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

renderTemplate(tripEventsListElement, createNewEventTemplate(events[0]), 'beforeend');
renderTemplate(tripEventsListElement,createTripItemListEditTemplate(events[1]),'beforeend');

for (let i = 0; i < TRIP_EVENTS_COUNT; i++) {
  renderTemplate(tripEventsListElement,createTripItemListEventsTemplate(events[i]),'beforeend');
}
