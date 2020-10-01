const { celebrate, Joi } = require('celebrate');
const {
  email, password, link, name, about, avatar, excessObjects,
} = require('./celebrateParametres');

//
const validateRegister = celebrate({
  body: Joi.object().keys({
    name, about, avatar, email, password,
  })
    .messages(excessObjects),
});

const validateLogin = celebrate({
  body: Joi.object().keys({ email, password })
    .messages(excessObjects),
});

const validateCard = celebrate({
  body: Joi.object().keys({ name, link })
    .messages(excessObjects),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({ name, about })
    .messages(excessObjects),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({ avatar })
    .messages(excessObjects),
});

module.exports = {
  validateLogin,
  validateRegister,
  validateUserUpdate,
  validateAvatar,
  validateCard,
};
