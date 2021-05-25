import Observer from '../utils/observer';

export default class Offers extends Observer{
  constructor() {
    super();
    this._offers = new Map();
  }

  setOffers(offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer.offers));
  }

  getOffers() {
    return this._offers;
  }
}
