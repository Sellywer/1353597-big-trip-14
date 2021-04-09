export
const createFiltersItemTemplate = (filter) => {
  const {name, count} = filter;

  return `<div class="trip-filters__filter">
                  <input id="filter-${name}"
                  class="trip-filters__filter-input  visually-hidden"
                   type="radio" name="trip-filter"
                   value="${name}">
                  <label class="trip-filters__filter-label" for="filter-${name}">${name} ${count}</label>
                </div>`;
};

const createFiltersTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((item) => createFiltersItemTemplate(item))
    .join('');

  return `<div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
                    ${filterItemsTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
            </div>`;
};

export {createFiltersTemplate};
