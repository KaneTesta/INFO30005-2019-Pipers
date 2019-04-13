var mongoose = require('mongoose');
var Recipe = mongoose.model('recipes');
var Contact = mongoose.model('contacts');
var Storage = mongoose.model('storage');

var findRecipeByIngredient = function (req, res) {
    query = req.params.ingredients.split('+')
    Recipe.find({ingredients: {$all: query}}, function(err, recipe){
        if(!err){
            res.json(recipe)
        }
        else{
            res.sendStatus(404);
        }
    })
};

var insertRecipe = function (req, res) {
    var recipe = new Recipe({
        "title": req.body.title,
        "ingredients": req.body.ingredients,
        "method": req.body.method,
        "author": req.body.string,
        "serves": req.body.serves
    });

    recipe.save(function (err, newRecipe) {
        if(!err){
            res.send("Recipe: " + newRecipe.title + " added!");
        }
        else{
            res.status(500).send({error: err});
        }
    });

}

var findStorageInfo = function (req, res) {
    var ingredientName = new RegExp('^' + req.params.ingredient, 'i');

    Storage.find({ingredient: {$regex: ingredientName}}, function(err, info){
        if(!err){
            res.json(info);
        }
        else{
            res.sendStatus(404);
        }
    })
};

var findContact = function (req, res) {

    Contact.find(req.query, function(err, info){
        if(!err){
            res.send(info);
            res.sendStatus(200);
        }
        else{
            res.sendStatus(404);
        }
    })
};

var insertContact = function (req, res) {
    var contact = new Contact({
        "name": req.body.name,
        "phone": req.body.phone,
        "address": req.body.address
    });
    contact.save(function (err, newContact) {
        if(!err){
            res.send(name + " added!")
        }
        else{
            res.status(500).send({error: err});
        }
    });
};


module.exports = {
    findRecipeByIngredient,
    insertRecipe,
    findStorageInfo,
    findContact,
    insertContact
};
