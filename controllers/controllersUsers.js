const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/modelUser');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const {
  SUCCESS,
  CLIENT_ERROR,
} = require('../libs/statusMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

// 1. контроллер createUser создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new UnauthorizedError({ message: CLIENT_ERROR.UNAUTHORIZED });
      } else next(err);
    })
    .then((user) => res.status(201).send({
      data: {
        name: user.name, about: user.about, avatar, email: user.email,
      },
    }))
    .catch(next);
};

// 2. контроллер login получает из запроса почту и пароль и проверяет их
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: SUCCESS.AUTHORIZATION });
    })
    .catch(next);
};

// 3. контроллер getAllUsers возвращает всех пользователей
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// 4. контроллер getCurrentUser возвращает пользователя по _id
const getCurrentUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: CLIENT_ERROR.USER_NOT_FOUND });
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// 5. контроллер updateUser обновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => new NotFoundError({ message: CLIENT_ERROR.USER_NOT_FOUND }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new BadRequestError({ message: `${err.message}` });
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// 6. контроллер updateAvatar обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => new NotFoundError({ message: CLIENT_ERROR.USER_NOT_FOUND }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new BadRequestError({ message: `${err.message}` });
    })
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch(next);
};

module.exports = {
  login,
  getAllUsers,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
};
