import {nanoid} from 'nanoid';
import {getRandomInteger,
  getRandomArrayElement,
  getRandomArray} from '../utils/common';
import {getDateFrom,
  getDateTo} from '../utils/event';

const generateRouteTypes = () => {
  const ROUTE_TYPES  = [
    'Check-in',
    'Sightseeing',
    'Restaurant',
    'Taxi',
    'Bus',
    'Train',
    'Ship',
    'Transport',
    'Drive',
    'Flight',
  ];
  return getRandomArrayElement(ROUTE_TYPES);
};

const generateDestinationCities = () => {
  const DESTINATION_CITIES = [
    'Chamonix',
    'Amsterdam',
    'Geneva',
    'Ufa',
    'Praha',
    'Paris',
  ];
  return getRandomArrayElement(DESTINATION_CITIES);
};

const generateDescription = () => {
  const DESCRIPTIONS  = [
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
  return getRandomArray(DESCRIPTIONS, 1, 5);
};

const generateOffers = () => {
  const OFFERS = [
    {
      title: 'Add luggage',
      price: 40,
    },
    {
      title: 'Switch to comfort class',
      price: 100,
    },
    {
      title: 'Add meal',
      price: 15,
    },
    {
      title: 'Choose seats',
      price: 5,
    },
    {
      title: 'Travel by train',
      price: 40,
    },
  ];

  return getRandomArray(OFFERS, 0, 5);
};

const generatePictures = () => {
  const PICTURES = [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 5)}`,
      alt: 'Фото великолепного заката',
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(10, 19)}`,
      alt: 'Фото горы Иремель',
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(20, 29)}`,
      alt: 'Фото в Диснейлэнде',
    },
  ];

  return getRandomArray(PICTURES, 1, 3);
};

export const generatePoint = () => {
  const dateFrom = getDateFrom();

  return {
    type: generateRouteTypes(),
    offers: generateOffers(),
    city: generateDestinationCities(),
    destination: {
      description: generateDescription().join(' '),
      pictures: generatePictures(),
    },
    dateFrom: dateFrom,
    dateTo: getDateTo(dateFrom),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(10, 1000),
    id: nanoid(),
  };
};
