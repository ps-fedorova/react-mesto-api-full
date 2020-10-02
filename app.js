// Здесь только настройки сервера

// Ключ заносят в переменные окружения.
// Для этого создают файл с расширением .env в корне проекта, и в нём объявляют env-переменные:
// NODE_ENV=production
// JWT_SECRET=eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b
// Чтобы загрузить этот файл в Node.js, нужно установить в проект модуль dotenv
require('dotenv').config();

const express = require('express');

const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const NotFoundError = require('./errors/404_NotFoundError');

const { auth } = require('./middleware/auth');
const { limiter } = require('./middleware/expressRateLimit');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { validateRegister, validateLogin } = require('./middleware/celebrateValidation/celebrateValidation');

const { usersRouter, cardsRouter } = require('./routes/exports');

const { SERVER_ERROR, CLIENT_ERROR } = require('./libs/statusMessages');

const { login, createUser } = require('./controllers/controllersUsers');

const app = express();
const { PORT = 3000 } = process.env; // const PORT = process.env.PORT || 3000;

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', { // подключение БД
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('База данных подключена');
  })
  .catch((err) => {
    console.log(`Ошибка при подключении базы данных: ${err}`);
  });

app.use(requestLogger);

app.use(helmet()); // для простановки security-заголовков для API
app.use(limiter); // для ограничения количества запросов (до 100 раз за 15 минут)

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: false })); // для приёма веб-страниц внутри POST-запроса

app.get('/crash-test', () => { // краш-тест сервера
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);

app.use('/users', auth, usersRouter); // отдать пути и защитить их авторизацией
app.use('/cards', auth, cardsRouter);

app.use(() => {
  throw new NotFoundError({ message: CLIENT_ERROR.RESOURCE_NOT_FOUND });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.status !== '500') {
    res.status(err.status)
      .send(err.message);
    return;
  }
  res.status(500)
    .send({ message: `${SERVER_ERROR.INTERNAL_SERVER_ERROR}: ${err.message}` });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение запущено, порт ${PORT}`);
});
