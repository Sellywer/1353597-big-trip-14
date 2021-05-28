import { remove, render, RenderPosition, replace } from '../utils/render';
import InfoView from '../view/info-main';

export default class InfoPresenter {
  constructor(infoContainer, EventsModel) {
    this._infoContainer = infoContainer;
    this._EventsModel = EventsModel;
    this._points = null;

    this._infoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._EventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevInfoComponent = this._infoComponent;
    this._points = this._EventsModel.getEvents();

    if (this._points.length) {
      this._infoComponent = new InfoView(this._points);

      if (prevInfoComponent === null) {
        render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
        return;
      }

      replace(this._infoComponent, prevInfoComponent);
      remove(prevInfoComponent);
    }

    if (!this._points.length) {
      remove(prevInfoComponent);
      this._infoComponent = null;
    }
  }

  _handleModelEvent() {
    this.init();
  }
}
