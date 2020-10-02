const Card = require('../models/modelCard');
const BadRequestError = require('../errors/400_BadRequestError');
const NotFoundError = require('../errors/404_NotFoundError');
const ForbiddenError = require('../errors/403_ForbiddenError');

const {
  SUCCESS,
  CLIENT_ERROR,
} = require('../libs/statusMessages');

// 1. контроллер getCards возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// 2. контроллер createCard создает карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .catch((err) => {
      throw new BadRequestError({ message: `${err.message}` });
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// 3. контроллер deleteCard удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: CLIENT_ERROR.CARD_NOT_FOUND });
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: CLIENT_ERROR.FORBIDDEN });
      }
      Card.findByIdAndDelete(req.params._id)
        .then(() => res.send({ message: SUCCESS.REMOVE_CARD }))
        .catch(next);
    })
    .catch(next);
};

// 4. контроллер likeCard ставит лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: CLIENT_ERROR.CARD_NOT_FOUND });
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

// 5. контроллер dislikeCard убирает лайк с карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: CLIENT_ERROR.CARD_NOT_FOUND });
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
