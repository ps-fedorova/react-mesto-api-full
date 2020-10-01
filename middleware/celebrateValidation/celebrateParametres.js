const { Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  string, empty, min, max, required, emailMessage, uri, excess,
} = require('../../libs/joiMessages');

//
const uriCustomScheme = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError(uri);
  }
  return value;
};

//
const email = Joi
  .string()
  .required()
  .email()
  .messages({
    'string.base': string,
    'string.empty': empty,
    'string.email': emailMessage,
    'any.required': required,
  });

//
const password = Joi
  .string()
  .required()
  .min(8)
  .messages({
    'string.base': string,
    'string.empty': empty,
    'string.min': min,
    'any.required': required,
  });

//
const link = Joi
  .string()
  .required()
  .uri()
  .messages({
    'string.base': string,
    'string.empty': empty,
    'string.uri': uri,
    'any.required': required,
  });

//
const avatar = Joi
  .string()
  .required()
  .custom(uriCustomScheme)
  .messages({
    'string.base': string,
    'string.empty': empty,
    'any.custom': uri,
    'any.required': required,
  });

//
const name = Joi
  .string()
  .required()
  .min(2)
  .max(30)
  .messages({
    'string.base': string,
    'string.empty': empty,
    'string.min': min,
    'string.max': max,
    'any.required': required,
  });

//
const about = Joi
  .string()
  .required()
  .min(2)
  .max(30)
  .messages({
    'string.base': string,
    'string.empty': empty,
    'string.min': min,
    'string.max': max,
    'any.required': required,
  });

//
const excessObjects = {
  'object.unknown': excess,
};

module.exports = {
  email,
  password,
  link,
  avatar,
  name,
  about,
  excessObjects,
};
