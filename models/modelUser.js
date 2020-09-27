const mongoose = require('mongoose');

const {
  requiredTrue,
  min,
  max,
  validURL,
} = require('../libs/validationParameters');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: requiredTrue,
    minlength: min(2),
    maxlength: max(30),
  },
  about: {
    type: String,
    required: requiredTrue,
    minlength: min(2),
    maxlength: max(30),
  },
  avatar: {
    type: String,
    required: requiredTrue,
    match: validURL,
  },
});

module.exports = mongoose.model('user', userSchema);
