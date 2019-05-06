var mongoose = require('mongoose');
var Recipe = mongoose.model('recipe');
var Storage = mongoose.model('storage');

// Find recipes containing one or multiple ingredients
var findRecipeByIngredients = (query, callback) => {
    //Recipe.find({ ingredients: { $in: query } }, function (err, recipes) {
    Recipe
        .byQuery(query)
        .exec(function (err, recipes) {
            for (let i = 0; i < recipes.length; ++i) {
                recipes[i].score = getRecipeScore(ingredients, recipes[i]);
            }

            recipes = recipes.filter(function (el) {
                // Check score
                if (el.score <= 0) {
                    return false;
                }

                // Check time
                if (maxTime !== null && el.totalTime > maxTime) {
                    return false;
                }

                return true;
            });

            recipes.sort(function (recipe1, recipe2) {
                return recipe2.score - recipe1.score;
            });

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

var findRecipeByID = (req, res, next) => {
    Recipe.findById(req.params.id, function (err, result) {
        if (!err) {
            res.json(result.toJSON());
        }
        else {
            console.log(err);
        }
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
