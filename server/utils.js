import { ObjectId } from 'mongodb';

const getMongoRegexValue = (value, condition) => {
  if (condition === 'contain') {
    return new RegExp(value, 'gi');
  }
  return new RegExp(`^((?!${value}).)*$`, 'g');
};

export const convertToMongoType = (value, type, condition) => {
  switch (type) {
    case 'String':
      return condition === '$regex' || condition === '$!regex' ? getMongoRegexValue(value) : value;
    case 'Int':
      return +value;
    case 'ID':
      return new ObjectId(value);
  }
};

export const mongoOperatorMapper = operator => {
  switch (operator) {
    case 'contain':
      return '$regex';
    case 'not_contain':
      return '$regex';
    default:
      return operator;
  }
};