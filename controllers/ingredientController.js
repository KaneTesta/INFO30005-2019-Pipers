var mongoose = require('mongoose');
var Ingredient = mongoose.model('ingredient');

module.exports.getIngredients = function (req, res) {
    Ingredient.
        find({}).
        sort({ name: 1 }).
        exec((err, ingredients) => {
            if (!err) {
                res.json(ingredients.map((i) => { return i.name }))
            } else {
                res.sendStatus(500);
                console.log(err);
            }
        });
};

