import SiteMenuView from './view/site-menu';
import InfoMainView from './view/info-main';
import FiltersView from './view/filters';
import EventsModel from './model/events';

import BoardPresenter  from './presenter/board';

import {generatePoint} from './mock/point-mock';
import {generateFilter} from './mock/filters';
import {render, RenderPosition} from './utils/render';

const TRIP_EVENTS_COUNT = 4;

const events = new Array(TRIP_EVENTS_COUNT).fill().map(generatePoint);

const filters = generateFilter(events);

const mainElement = document.querySelector('.page-body');
const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteMainElement.querySelector('.trip-controls__filters');
const boardContainer = mainElement.querySelector('.board-container');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

render(siteMainElement, new InfoMainView(events), RenderPosition.AFTERBEGIN);
render(siteHeaderElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(siteFilterElement, new FiltersView(filters),  RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(boardContainer, eventsModel);
boardPresenter.init(events);
