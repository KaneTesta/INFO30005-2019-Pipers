var mongoose = require('mongoose');
var Recipe = mongoose.model('recipe');

var ingredientController = require("./ingredientController");

var findRecipeByIngredients = (query, options, callback) => {
    if (callback === null || callback === undefined) {
        return;
    }

    if (query === null || query === undefined) {
        callback({
            error: "query cannot be null"
        });

        return;
    }

    Recipe.aggregatePaginate(Recipe.byQuery(query), options,
        (err, recipes, pageCount, count) => {
            callback({
                error: err,
                result: recipes,
                pageCount: pageCount,
                count: count,
            });
        }
    );
};

var findRecipeByID = (id, callback) => {
    Recipe.findById(id, function (err, result) {
        callback({
            error: err,
            result: result
        });
    })
}

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

/**
 * Convert a recipe to a target serving size
 */
var convertRecipe = (recipe, targetSize) => {
    for (let i = 0; i < recipe.ingredients.length; ++i) {
        if (targetSize != recipe.serves) {
            recipe.ingredients[i].displayText = ingredientController.convertQuantity(
                recipe.ingredients[i], recipe.serves, targetSize
            );
        } else {
            recipe.ingredients[i].displayText = recipe.ingredients[i].text;
        }
    }
}


// Exporting callbacks
module.exports = {
    findRecipeByIngredients,
    findRecipeByID,
    findStorageInfo,
    convertRecipe,
};
