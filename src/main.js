import {createSiteMenuTemplate} from './view/navigation';
import {createFilterTemplate} from './view/trip-filters.js';
import {createInfoMainTemplate} from './view/trip-info-main.js';
import {createSortTemplate} from './view/trip-sort.js';
import {createTripListTemplate} from './view/trip-list.js';
import {createTripItemListEditTemplate} from './view/trip-item-list-edit.js';
import {createTripItemListEventsTemplate} from './view/trip-item.js';

const TRIP_EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');


// Навигация, сортировка, главная информация по стоимости и напрвлению

render(siteHeaderElement, createSiteMenuTemplate(), 'beforeend');
render(siteFilterElement, createFilterTemplate(), 'beforeend');
render(siteMainElement, createInfoMainTemplate(), 'afterbegin');

// Сортировка

render(tripEventsElement, createSortTemplate(), 'afterbegin');

// trip-list

render(tripEventsElement, createTripListTemplate(), 'beforeend');

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripEventsListElement,createTripItemListEditTemplate(),'beforeend');

for (let i = 0; i < TRIP_EVENTS_COUNT; i++) {
  render(tripEventsListElement,createTripItemListEventsTemplate(),'beforeend');
}
