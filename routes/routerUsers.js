const usersRouter = require('express')
  .Router();
const { validateUserUpdate, validateAvatar, validateId } = require('../middleware/celebrateValidation/celebrateValidation');
const {
  getAllUsers,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/controllersUsers');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:_id', validateId, getCurrentUser);
usersRouter.patch('/me', validateUserUpdate, updateUser);
usersRouter.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = usersRouter;
