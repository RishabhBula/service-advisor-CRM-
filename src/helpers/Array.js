export const InsertAtParticularIndex = (arr, index, data) => {
  arr.splice(index, 0, data);
  return arr;
};
