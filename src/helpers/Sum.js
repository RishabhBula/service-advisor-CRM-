import { logger } from "./Logger";

/**
 *
 */
export const getSumOfArray = arr => {
  logger("*******This is fuction array******", arr);
  return arr.length ? arr.reduce((total, num) => total + num) : 0;
};

/**
 *
 */
export const calculateValues = (total, value, type = "%") => {
  switch (type) {
    case "%":
      return (total * value) / 100;
    case "$":
      return value;
    default:
      return value;
  }
};

export const calculateSubTotal = (cost, quantity, hour, rate) => {
  return (parseFloat(cost || hour) * parseFloat(quantity|| rate))
}