const rateLimit = require('express-rate-limit');
const {
  CLIENT_ERROR,
} = require('../libs/statusMessages');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // с одного IP можно совершить максимум 100 запросов
  message: { message: CLIENT_ERROR.TOO_MANY_REQUESTS },
});

module.exports = {
  limiter,
};
