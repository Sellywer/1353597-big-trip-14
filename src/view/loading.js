import AbstractView from '../view/abstract';

const createNoEventTemplate = () => {
  return `<p class="board__no-events">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoEventTemplate();
  }
}
