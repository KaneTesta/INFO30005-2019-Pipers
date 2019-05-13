var mongoose = require('mongoose');
var Recipe = mongoose.model('recipe');
var Storage = mongoose.model('storage');

// Find recipes containing one or multiple ingredients
var findRecipeByIngredients = (query, callback) => {
    if (query === null || query === undefined) {
        callback({ error: "query must be defined" });
        return;
    }

    if (query.ingredients && !Array.isArray(query.ingredients)) {
        callback({ error: "ingredients must be an array" });
        return;
    }

    if (query.ingredients_priority && !Array.isArray(query.ingredients_priority)) {
        callback({ error: "ingredients_priority must be an array" });
        return;
    }

    if (query.unavailable_cookware && !Array.isArray(query.unavailable_cookware)) {
        callback({ error: "unavailable_cookware must be an array" });
        return;
    }

    Recipe
        .byQuery(query)
        .exec(function (err, recipes) {
            callback({
                error: err,
                result: recipes.slice(0, 40)
            });
        });
};

var findRecipeByID = (id, callback) => {
    Recipe.findById(id, function (err, result) {
        callback({
            error: err,
            result: result
        });
    })
}

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




// Exporting callbacks
module.exports = {
    findRecipeByIngredients,
    findRecipeByID,
    insertRecipe,
    findStorageInfo,
};
