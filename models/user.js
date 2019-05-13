const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user_id: {
    type: String,
    require: [true, 'An user needs an id'],
  },
  display_name: String,
  ingredients: [String],
});

mongoose.model('user', userSchema, 'users');
