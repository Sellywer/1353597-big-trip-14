import dayjs from 'dayjs';


export const getItemsUniq = (items) => [...new Set(items)];

export const getCostsByTripType = (points, type) => {
  const pointsByType = points.filter((point) => point.type === type);
  return pointsByType.reduce((sum, item) => sum + item.basePrice, 0);
};

export const countPointsByTripType = (points, type) => {
  return points.filter((point) => point.type === type).length;
};

export const getDurationByType = (points, type) => {
  const pointsTypes = points.filter((point) => point.type === type);
  const duration = pointsTypes.reduce((totalDuration, point) => {
    return totalDuration + dayjs(point.dateTo).diff(point.dateFrom,'minute');
  }, 0);
  return duration;
};
