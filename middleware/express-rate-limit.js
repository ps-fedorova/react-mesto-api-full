const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // с одного IP можно совершить максимум 100 запросов
  message: 'Запросы, поступившие с вашего IP-адреса, похожи на автоматические. Попробуйте повторить попытку позже',
});

module.exports = {
  limiter,
};
