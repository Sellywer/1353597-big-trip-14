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
import {MenuItem, UpdateType, FilterType, OfflineMessage} from './utils/const';

import {isOnline} from './utils/common.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {toast} from './utils/toast.js';

import Api from './api/api.js';

const AUTHORIZATION = 'Basic Sellywer21140500206';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'BigTrip-localstorage';
const OFFERS_PREFIX = 'BigTrip-offers-localstorage';
const DESTINATIONS_PREFIX = 'BigTrip-destinations-localstorage';

const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const OFFERS_STORE_NAME = `${OFFERS_PREFIX}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `${DESTINATIONS_PREFIX}-${STORE_VER}`;

let statisticsComponent = null;

const mainElement = document.querySelector('.page-body');
const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store, offersStore, destinationsStore);

const siteMenuComponent = new SiteMenuView();

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const boardPresenter = new BoardPresenter(boardContainer, eventsModel, filterModel, offersModel, destinationsModel, apiWithProvider);
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

  if (!isOnline()) {
    toast(OfflineMessage.NEW_EVENT);
    return;
  }

  boardPresenter.createEvent(handleEventNewFormClose);
  addNewEventButton.disabled = true;
});

Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getEvents(),
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

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  toast(OfflineMessage.DISCONNECT);
  document.title += ' [offline]';
});
