import {nanoid} from 'nanoid';
import {getRandomInteger,
  getRandomArrayElement,
  getRandomArray, shuffle} from '../utils/common';
import {getDateFrom,
  getDateTo} from '../utils/event';

const DESTINATION_COUNT = 6;

const ROUTE_TYPES  = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const DESTINATION_CITIES = [
  'Chamonix',
  'Amsterdam',
  'Geneva',
  'Ufa',
  'Praha',
  'Paris',
];

export const DESCRIPTIONS  = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const busOptions = [
  {
    id: 1,
    title: 'Add luggage',
    price: 10,
  },
  {
    id: 2,
    title: 'Choose seats',
    price: 5,
  },
];

const checkinOptions = [
  {
    id: 3,
    title: 'Add breakfast',
    price: 20,
  },
  {
    id: 4,
    title: 'Early check-in',
    price: 50,
  },
];

const driveOptions = [
  {
    id: 5,
    title: 'Rent a car',
    price: 200,
  },
];

const flightOptions = [
  {
    id: 6,
    title: 'Add luggage',
    price: 30,
  },
  {
    id: 7,
    title: 'Add meal',
    price: 20,
  },
  {
    id: 8,
    title: 'Choose seats',
    price: 10,
  },
  {
    id: 9,
    title: 'Switch to comfort class',
    price: 100,
  },
];

const restaurantOptions = [
  {
    id: 10,
    title: 'Add meal',
    price: 120,
  },
];

const shipOptions = [
  {
    id: 11,
    title: 'Choose seats',
    price: 10,
  },
  {
    id: 12,
    title: 'Switch to comfort class',
    price: 100,
  },
];

const sightseeingOptions = [
  {
    id: 13,
    title: 'Choose seats',
    price: 5,
  },
];

const taxiOptions = [
  {
    id: 14,
    title: 'Switch to comfort class',
    price: 100,
  },
];

const trainOptions = [
  {
    id: 15,
    title: 'Add meal',
    price: 20,
  },
  {
    id: 16,
    title: 'Choose seats',
    price: 100,
  },
];

const transportOptions = [
  {
    id: 17,
    title: 'Buy day pass',
    price: 10,
  },
  {
    id: 18,
    title: 'Buy week pass',
    price: 25,
  },
  {
    id: 19,
    title: 'Buy month pass',
    price: 50,
  },
];

export const optionsMap = new Map();
optionsMap
  .set('bus', busOptions)
  .set('check-in', checkinOptions)
  .set('drive', driveOptions)
  .set('flight', flightOptions)
  .set('sightseeing', sightseeingOptions)
  .set('ship', shipOptions)
  .set('restaurant', restaurantOptions)
  .set('taxi', taxiOptions)
  .set('train', trainOptions)
  .set('transport', transportOptions);

const generateRouteTypes = () => getRandomArrayElement(ROUTE_TYPES);
export const generateDescription = () => new Array(getRandomInteger(1, 5))
  .fill()
  .map(() => DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)])
  .join(' ');

export const generatePictures = () => {
  const PICTURES = [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 5)}`,
      alt: generateDescription(),
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(10, 19)}`,
      alt: generateDescription(),
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(20, 29)}`,
      alt: generateDescription(),
    },
  ];

  return getRandomArray(PICTURES, 1, 3);
};
// destination

const getDescriptionFromSentences = (array) => {
  const copiedArray = array.slice();
  shuffle(copiedArray);

  const descriptionSentences = copiedArray.slice(0, getRandomInteger(1, 5));
  return descriptionSentences.join(' ');
};

const createDestination = () => {
  const pictures = generatePictures();

  const destination = {
    description: getDescriptionFromSentences(DESCRIPTIONS),
    city: getRandomArrayElement(DESTINATION_CITIES),
    pictures: pictures,
  };
  return destination;
};

const createDestinations = () => new Array(DESTINATION_COUNT).fill(null)
  .map(createDestination);

export const destinations = createDestinations();
//


export const generatePoint = (destination) => {
  const dateFrom = getDateFrom();
  const type = generateRouteTypes();

  return {
    offers: getRandomArray(optionsMap.get(type)),
    destination,
    dateFrom: dateFrom,
    dateTo: getDateTo(dateFrom),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    basePrice: getRandomInteger(10, 1000),
    id: nanoid(),
    type,
  };
};

export const renderPoints = (count, destinations) => {
  const events = new Array(count).fill().
    map(
      () => {
        return generatePoint(destinations[getRandomInteger(0, destinations.length - 1)]);
      });

  return events;
};
