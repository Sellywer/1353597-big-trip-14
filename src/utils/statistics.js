import dayjs from 'dayjs';

export const getItemsUniq = (items) => [...new Set(items)];

export const getCostsByTripType = (points, type) => {
  const pointsByType = points.points.filter((point) => point.type === type);
  const price = pointsByType.reduce((sum, item) => sum + item.basePrice, 0);

  return {type, price};
};

export const countPointsByTripType = (points, type) => {
  const pointsCount = points.points.filter((point) => point.type === type).length;

  return {type, pointsCount};
};

export const getDurationByType = (points, type) => {
  const pointsTypes = points.points.filter((point) => point.type === type);

  let duration = 0;
  pointsTypes.forEach((point) => {
    duration += dayjs(point.dateTo).diff(point.dateFrom,'m');
  });
  return {type, duration};
};
