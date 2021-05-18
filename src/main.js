import SiteMenuView from './view/site-menu';
import InfoMainView from './view/info-main';
import EventsModel from './model/events';
import FilterModel from './model/filter';

import BoardPresenter  from './presenter/board';
import FilterPresenter from './presenter/filter';

import {generatePoint} from './mock/point-mock';
import {render, RenderPosition} from './utils/render';

const TRIP_EVENTS_COUNT = 7;

const events = new Array(TRIP_EVENTS_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.page-body');
const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

render(siteMainElement, new InfoMainView(events), RenderPosition.AFTERBEGIN);
render(siteHeaderElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(boardContainer, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, eventsModel);

boardPresenter.init();

filterPresenter.init();
