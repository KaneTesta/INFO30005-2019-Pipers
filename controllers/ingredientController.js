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

module.exports.getIngredientInfo = (req, res) => {
    Ingredient.findOne({"name": req.params.name}, (err, ingredient) => {
        if (!err) {
            if (ingredient) {
                res.json(ingredient);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(500);
        }
    })
}

