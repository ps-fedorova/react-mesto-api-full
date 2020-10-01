const cardsRouter = require('express')
  .Router();
const { validateCard } = require('../middleware/celebrateValidation/celebrateValidation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/controllersCards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', validateCard, createCard);
cardsRouter.delete('/:_id', deleteCard);
cardsRouter.put('/:_id/likes', likeCard);
cardsRouter.delete('/:_id/likes', dislikeCard);

module.exports = cardsRouter;
