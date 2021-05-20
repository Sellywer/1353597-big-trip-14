import SiteMenuView from './view/site-menu';
import InfoMainView from './view/info-main';
import StatisticsView from './view/statistics.js';
import EventsModel from './model/events';
import FilterModel from './model/filter';

import BoardPresenter  from './presenter/board';
import FilterPresenter from './presenter/filter';

import {renderPoints, destinations} from './mock/point-mock';
import {render, remove, RenderPosition} from './utils/render';
import {MenuItem, UpdateType, FilterType} from './utils/const';

const TRIP_EVENTS_COUNT = 17;
let statisticsComponent = null;
const events = renderPoints(TRIP_EVENTS_COUNT, destinations);

const mainElement = document.querySelector('.page-body');
const siteMenuComponent = new SiteMenuView();

const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

render(siteMainElement, new InfoMainView(events), RenderPosition.AFTERBEGIN);
render(siteHeaderElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(boardContainer, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, eventsModel);

const handleEventNewFormClose = () => {
  addNewEventButton.removeAttribute('disabled');
};

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

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

boardPresenter.init();
filterPresenter.init();

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
