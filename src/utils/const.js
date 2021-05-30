export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATISTICS: 'STATISTICS',
};

export const OfflineMessage = {
  NEW_EVENT: 'You can\'t create new event offline',
  DISCONNECT: 'Lost internet connection',
  SAVE_EVENT: 'You can\'t save event offline',
  DELETE_EVENT: 'You can\'t delete event offline',
  EDIT_EVENT: 'You can\'t edit event offline',
  RECONNECT: 'Connection restored',
};
