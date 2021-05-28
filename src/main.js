import SiteMenuView from './view/site-menu';
import StatisticsView from './view/statistics.js';
import EventsModel from './model/events';
import FilterModel from './model/filter';
import DestinationsModel from './model/destinations';
import OffersModel from './model/offers';

import BoardPresenter  from './presenter/board';
import FilterPresenter from './presenter/filter';
import InfoPresenter from './presenter/info-presenter';

import {render, remove, RenderPosition} from './utils/render';
import {MenuItem, UpdateType, FilterType} from './utils/const';

import Api from './api.js';

const AUTHORIZATION = 'Basic Sellywer2114';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

let statisticsComponent = null;

const mainElement = document.querySelector('.page-body');
const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);

const siteMenuComponent = new SiteMenuView();

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const boardPresenter = new BoardPresenter(boardContainer, eventsModel, filterModel, offersModel, destinationsModel, api);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, eventsModel, offersModel, destinationsModel);
const infoPresenter = new InfoPresenter(siteMainElement, eventsModel);

addNewEventButton.disabled = true;

const handleSiteMenuClick = (menuItem) => {
  siteMenuComponent.setMenuItem(menuItem);

  switch (menuItem) {
    case MenuItem.TABLE:
      boardPresenter.init();
      remove(statisticsComponent);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;

    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(boardContainer, statisticsComponent, RenderPosition.BEFOREEND);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
  }
};

const handleEventNewFormClose = () => {
  addNewEventButton.removeAttribute('disabled');
};

addNewEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  const menuToggle = document.querySelector('.trip-tabs__btn--active');

  if (menuToggle.dataset.menuType !== MenuItem.TABLE) {
    handleSiteMenuClick(MenuItem.TABLE);
  }
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  boardPresenter.createEvent(handleEventNewFormClose);
  addNewEventButton.disabled = true;
});

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents(),
]).then(([offers, destinations, events]) => {
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);
  eventsModel.setEvents(UpdateType.INIT, events);
  infoPresenter.init();
  render(siteHeaderElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  filterPresenter.init();
  addNewEventButton.disabled = false;
})
  .catch(() => {
    offersModel.setOffers([]);
    destinationsModel.setDestinations([]);
    eventsModel.setEvents(UpdateType.INIT, []);
    render(siteHeaderElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

boardPresenter.init();
