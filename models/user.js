var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    user_id: {
        type: String,
        require: [true, 'An user needs an id']
    },
    ingredients: [String]
});

mongoose.model('user', userSchema, 'users');
