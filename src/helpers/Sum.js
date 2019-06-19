import { logger } from "./Logger";

/**
 *
 */
export const getSumOfArray = arr => {
  logger("*******This is fuction array******", arr);

  return arr.reduce((total, num) => total + num);
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
