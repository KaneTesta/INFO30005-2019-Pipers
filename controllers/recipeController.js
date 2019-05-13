const mongoose = require('mongoose');

const Recipe = mongoose.model('recipe');
const Storage = mongoose.model('storage');

const findRecipeByIngredients = (query, options, callback) => {
  // Recipe.find({ ingredients: { $in: query } }, function (err, recipes) {
  /*     Recipe
            .byQuery(query)
            .exec(function (err, recipes) {
                callback({
                    error: err,
                    result: recipes.slice(0, 40)
                });
            }); */
  Recipe.aggregatePaginate(Recipe.byQuery(query), options,
    (err, recipes, pageCount, count) => {
      callback({
        error: err,
        result: recipes,
        pageCount,
        count,
      });
    });
};

const findRecipeByID = (id, callback) => {
  Recipe.findById(id, (err, result) => {
    callback({
      error: err,
      result,
    });
  });
};

// Insert one recipe
const insertRecipe = (recipe, callback) => {
  var recipe = new Recipe({
    title: recipe.title,
    ingredients: recipe.ingredients,
    method: recipe.method,
    author: recipe.string,
    serves: recipe.serves,
  });

  recipe.save((err, newRecipe) => {
    callback({
      error: err,
      result: `Recipe: ${newRecipe.title} added!`,
    });
  });
};

// Find storage information for one ingredient
const findStorageInfo = (req, res) => {
  const ingredientName = new RegExp(`^${req.params.ingredient}`, 'i');

  Storage.find({ ingredient: { $regex: ingredientName } }, (err, info) => {
    if (!err) {
      res.json(info);
    } else {
      res.sendStatus(404);
    }
  });
};


// Exporting callbacks
module.exports = {
  findRecipeByIngredients,
  findRecipeByID,
  insertRecipe,
  findStorageInfo,
};
