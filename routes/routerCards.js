const cardsRouter = require('express')
  .Router();
const { validateCard, validateId } = require('../middleware/celebrateValidation/celebrateValidation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/controllersCards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', validateCard, createCard);
cardsRouter.delete('/:_id', validateId, deleteCard);
cardsRouter.put('/:_id/likes', validateId, likeCard);
cardsRouter.delete('/:_id/likes', validateId, dislikeCard);

module.exports = cardsRouter;
