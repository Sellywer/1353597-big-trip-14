import AbstractView from './abstract.js';

const createFiltersItemTemplate = (filter, currentFilterType) => {
  const {name, count, type} = filter;

  return `<div class="trip-filters__filter">
                  <input id="filter-${name}"
                  class="trip-filters__filter-input  visually-hidden"
                    type="radio" name="trip-filter"
                    ${type === currentFilterType ? 'checked' : ''}
                   ${count === 0 ? 'disabled' : ''}
                    value="${name}">
                  <label class="trip-filters__filter-label" for="filter-${name}">${name} ${count}</label>
                </div>`;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((item) => createFiltersItemTemplate(item, currentFilterType))
    .join('');

  return `<div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
                    ${filterItemsTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
            </div>`;
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;

    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
