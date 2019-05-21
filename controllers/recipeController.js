var mongoose = require('mongoose');
var Recipe = mongoose.model('recipe');
var Storage = mongoose.model('storage');

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
