var mongoose = require('mongoose');
var User = mongoose.model('user');

// Insert one contact
var insertUser = (profile, callback) => {
    var user = new User({
        user_id: profile.id,
        display_name: profile.displayName
    });

    user.save((err, result) => {
        callback({
            err: err,
            result: [result]
        });
    });
};

// Find contacts by name
var findUser = (id, callback) => {
    User.find({ user_id: id }, (err, info) => {
        callback({
            error: err,
            result: info
        });
    });
};

// Find user or create if doesn't exist
var findOrCreateUser = (profile, callback) => {
    findUser(profile.id, function (msg) {
        if (msg.error || msg.result.length === 0) {
            insertUser(profile, callback);
        } else {
            callback(msg);
        }
    });
}

var updateUser = (id, user, callback) => {
    User.updateOne({ user_id: id }, user, (err, result) => {
        callback({
            error: err,
            result: result
        });
    });
}

// Delete one contact by id
var deleteUser = (id, callback) => {
    User.deleteOne({ user_id: id }, (err) => {
        callback({
            error: err,
            result: "Deleted"
        })
    });
}

var saveIngredients = (req, callback) => {
    let ingredients = req.body.ingredients;
    if (!ingredients) {
        callback({ error: "No ingredients sent as parameter", result: null });
    } else if (req.session && req.session.passport && req.session.passport.user) {
        findUser(req.session.passport.user, (msg) => {
            if (!msg.error && msg.result.length > 0) {
                let user = msg.result[0];
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
        callback({ error: "User not signed in", result: null });
    }
}

// Exporting callbacks
module.exports = {
    findUser,
    insertUser,
    findOrCreateUser,
    updateUser,
    deleteUser,

    saveIngredients
};
