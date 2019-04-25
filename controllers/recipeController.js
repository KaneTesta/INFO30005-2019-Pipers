var mongoose = require('mongoose');
var Recipe = mongoose.model('recipes');
var Contact = mongoose.model('contacts');
var Storage = mongoose.model('storage');

// Find recipes containing one or multiple ingredients
var findRecipeByIngredient = (query, callback) => {
    //Recipe.find({ ingredients: { $in: query } }, function (err, recipes) {
    Recipe.find({}, function (err, recipes) {
        callback({
            error: err,
            result: recipes
        });
    });
};

// Insert one recipe
var insertRecipe = (recipe, callback) => {
    var recipe = new Recipe({
        title: recipe.title,
        ingredients: recipe.ingredients,
        method: recipe.method,
        author: recipe.string,
        serves: recipe.serves
    });

    recipe.save((err, newRecipe) => {
        callback({
            error: err,
            result: 'Recipe: ' + newRecipe.title + ' added!'
        });
    });
};

// Find storage information for one ingredient
var findStorageInfo = (req, res) => {
    var ingredientName = new RegExp('^' + req.params.ingredient, 'i');

    Storage.find({ ingredient: { $regex: ingredientName } }, (err, info) => {
        if (!err) {
            res.json(info);
        } else {
            res.sendStatus(404);
        }
    });
};

// Find contacts by name
var findContact = (req, res) => {
    Contact.find(req.query, (err, info) => {
        if (!err) {
            res.send(info);
        } else {
            res.sendStatus(404);
        }
    });
};

// Insert one contact
var insertContact = (req, res) => {
    var contact = new Contact({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    });
    contact.save((err, newContact) => {
        if (!err) {
            res.send(newContact.name + ' added!');
        } else {
            res.status(500).send({ error: err });
        }
    });
};

// Exporting callbacks
module.exports = {
    findRecipeByIngredient,
    insertRecipe,
    findStorageInfo,
    findContact,
    insertContact
};
