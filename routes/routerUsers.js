const usersRouter = require('express')
  .Router();

const {
  getAllUsers,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/controllersUsers');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:_id', getCurrentUser);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
