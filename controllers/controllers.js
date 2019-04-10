var mongoose = require('mongoose');
var Recipe = mongoose.model('recipes');
var Contact = mongoose.model('contacts');
var Storage = mongoose.model('storage');

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

var findStorageInfo = function (req, res) {
    var ingredientName = req.params.recipe;
    Storage.find({ingredient: ingredient}, function(err, recipe){
        if(!err){
            res.send(storage);
        }
        else{
            res.sendStatus(404);
        }
    })
}


module.exports.findRecipeByIngredient = findRecipeByIngredient;