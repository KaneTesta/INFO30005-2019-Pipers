var mongoose = require('mongoose');
var Recipe = mongoose.model('recipes');
var Contact = mongoose.model('contacts');
var Storage = mongoose.model('storage');
var Ingredient = mongoose.model('ingredient');

// Find recipes containing one or multiple ingredients
/*
TODO: Modify to query by new ingredient model
*/
var findRecipeByIngredient = (req, res) => {
  var query = req.params.ingredients.split('+');
  Recipe.find({ ingredients: { $all: query } }, (err, recipe) => {
    if (!err) {
      res.json(recipe);
    } else {
      res.sendStatus(404);
    }
  });
};

// Insert one recipe
var insertRecipe = (req, res) => {
  var recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    method: req.body.method,
    author: req.body.string,
    serves: req.body.serves
  });

  recipe.save((err, newRecipe) => {
    if (!err) {
      res.send('Recipe: ' + newRecipe.title + ' added!');
    } else {
      res.status(500).send({ error: err });
    }
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
