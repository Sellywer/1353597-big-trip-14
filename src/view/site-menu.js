import {MenuItem} from '../utils/const.js';
import AbstractView from './abstract.js';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" data-menu-type="${MenuItem.TABLE}" href="#">Table</a>
            <a class="trip-tabs__btn" data-menu-type="${MenuItem.STATISTICS}" href="#">Stats</a>
          </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.classList.contains('trip-tabs__btn--active')) {

      return;
    }
    this._callback.menuClick(evt.target.dataset.menuType);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const menuItems = this.getElement().querySelectorAll('.trip-tabs__btn');

    menuItems.forEach((item) => {
      if (item.dataset.menuType === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      } else {
        item.classList.remove('trip-tabs__btn--active');
      }
    });
  }
}
