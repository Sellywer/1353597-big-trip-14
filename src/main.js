import {createSiteMenuTemplate} from './view/navigation';
import {createFiltersTemplate} from './view/trip-filters.js';
import {createInfoMainTemplate} from './view/trip-info-main.js';
import {createSortTemplate} from './view/trip-sort.js';
import {createTripListTemplate} from './view/trip-list.js';
import {createTripItemListEditTemplate} from './view/trip-item-list-edit.js';
import {createNewEventTemplate} from './view/new-event.js';
import {createTripItemListEventsTemplate} from './view/trip-item.js';
import {generatePoint} from './mock/point-mock';
import {generateFilter} from './filters.js';

const TRIP_EVENTS_COUNT = 10;

const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const events = new Array(TRIP_EVENTS_COUNT).fill().map(generatePoint);

const filters = generateFilter(events);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


// Навигация, сортировка, главная информация по стоимости и напрвлению

render(siteHeaderElement, createSiteMenuTemplate(), 'beforeend');
render(siteFilterElement, createFiltersTemplate(filters), 'beforeend');
render(siteMainElement, createInfoMainTemplate(events), 'afterbegin');

// Сортировка

render(tripEventsElement, createSortTemplate(), 'afterbegin');

// trip-list

render(tripEventsElement, createTripListTemplate(), 'beforeend');

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripEventsListElement, createNewEventTemplate(events[0]), 'beforeend');
render(tripEventsListElement,createTripItemListEditTemplate(events[1]),'beforeend');

for (let i = 0; i < TRIP_EVENTS_COUNT; i++) {
  render(tripEventsListElement,createTripItemListEventsTemplate(events[i]),'beforeend');
}
