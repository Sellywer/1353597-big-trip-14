import {createElement} from '../utils.js';

const createNoTaskTemplate = () => {
  return`<p class="trip-events__msg">
            Click New Event to create your first point
          </p>`;
};

class NoEvent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoTaskTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default NoEvent;
