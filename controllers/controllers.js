var mongoose = require('mongoose')
var Recipe = mongoose.model('recipes')

var findRecipeByIngredient = function (req, res) {
    var ingredientName = req.params.ingredient;
    Recipe.find({ingredient: ingredientName}, function(err, recipe){
        if(!err){
            res.send(recipe)
        }
        else{
            res.sendStatus(404);
        }
    })
}

module.exports.findRecipeByIngredient = findRecipeByIngredient;