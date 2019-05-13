const mongoose = require('mongoose');

const User = mongoose.model('user');

// Insert one contact
const insertUser = (profile, callback) => {
  const user = new User({
    user_id: profile.id,
    display_name: profile.displayName,
  });

  user.save((err, result) => {
    callback({
      err,
      result: [result],
    });
  });
};

// Find contacts by name
const findUser = (id, callback) => {
  User.find({ user_id: id }, (err, info) => {
    callback({
      error: err,
      result: info,
    });
  });
};

// Find user or create if doesn't exist
const findOrCreateUser = (profile, callback) => {
  findUser(profile.id, (msg) => {
    if (msg.error || msg.result.length === 0) {
      insertUser(profile, callback);
    } else {
      callback(msg);
    }
  });
};

const updateUser = (id, user, callback) => {
  User.updateOne({ user_id: id }, user, (err, result) => {
    callback({
      error: err,
      result,
    });
  });
};

// Delete one contact by id
const deleteUser = (id, callback) => {
  User.deleteOne({ user_id: id }, (err) => {
    callback({
      error: err,
      result: 'Deleted',
    });
  });
};

const saveIngredients = (req, callback) => {
  let { ingredients } = req.body;

  if (!ingredients) {
    ingredients = [];
  }

  if (req.session && req.session.passport && req.session.passport.user) {
    findUser(req.session.passport.user, (msg) => {
      if (!msg.error && msg.result.length > 0) {
        const user = msg.result[0];
        if (user && user.ingredients) {
          user.ingredients = ingredients;
          updateUser(user.user_id, user, (msg_update) => {
            callback(msg_update);
          });
        } else {
          callback(msg);
        }
      } else {
        callback(msg);
      }
    });
  } else {
    callback({ error: 'User not signed in', result: null });
  }
};

// Exporting callbacks
module.exports = {
  findUser,
  insertUser,
  findOrCreateUser,
  updateUser,
  deleteUser,

  saveIngredients,
};
