// Здесь только настройки сервера

const express = require('express');

const app = express();
// const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { usersRouter, cardsRouter } = require('./routes/exports');
const { limiter } = require('./middleware/express-rate-limit');
const {
  SERVER_ERROR,
  CLIENT_ERROR,
} = require('./libs/statusMessages');

const { PORT = 3000 } = process.env; // const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/mestodb', { // подключение БД
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log('База данных подключена');
  })
  .catch((err) => {
    console.log(`Ошибка при подключении базы данных: ${err}`);
  });

// Решение для временной авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '5f53d7573eefe90078a6c390',
  };
  next();
});

app.use(helmet()); // для простановки security-заголовков для API
app.use(limiter); // для ограничения количества запросов (до 100 раз за 15 минут)

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// отдать статичные данные из папки "public"
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter); // отдать пути
app.use('/cards', cardsRouter);

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

app.use((req, res) => {
  res.status(404)
    .send({ message: CLIENT_ERROR.RESOURCE_NOT_FOUND });
});

app.listen(PORT, () => {
  console.log(`Приложение запущено, порт ${PORT}`);
});
