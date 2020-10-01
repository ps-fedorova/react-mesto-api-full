const usersRouter = require('express')
  .Router();
const { validateUserUpdate, validateAvatar } = require('../middleware/celebrateValidation/celebrateValidation');
const {
  getAllUsers,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/controllersUsers');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:_id', getCurrentUser);
usersRouter.patch('/me', validateUserUpdate, updateUser);
usersRouter.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = usersRouter;
