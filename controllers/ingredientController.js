var mongoose = require('mongoose');
var Ingredient = mongoose.model('ingredient');

module.exports.getIngredients = function (req, res) {
    Ingredient.find({}, function (err, ingredients) {
        if (!err) {
            res.json(ingredients.map((i) => { return i.name }))
        } else {
            res.sendStatus(500);
            console.log(err);
        }
    });
};

