const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const UnauthorizedError = require('../errors/401_UnauthorizedError');

const {
  CLIENT_ERROR,
} = require('../libs/statusMessages');

const {
  requiredTrue,
  min,
  max,
} = require('../libs/validationParameters');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: requiredTrue,
    minlength: min(2),
    maxlength: max(30),
  },
  about: {
    type: String,
    required: requiredTrue,
    minlength: min(2),
    maxlength: max(30),
  },
  avatar: {
    type: String,
    required: requiredTrue,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: min(8),
    // необходимо добавить поле select, чтобы API не возвращал хеш пароля
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError({ message: CLIENT_ERROR.AUTHENTICATION });
      }
      return bcryptjs.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError({ message: CLIENT_ERROR.AUTHENTICATION });
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
