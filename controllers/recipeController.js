var mongoose = require('mongoose');
var Recipe = mongoose.model('recipe');
var Contact = mongoose.model('contact');
var Storage = mongoose.model('storage');

/**
 * 
 * @param {[{ingredient: String, quantity: number}]} ingredients
 * @param {{ingredients: [{ingredient: String, quantity: number}]}} recipe 
 */
function getRecipeScore(ingredients, recipe) {
    let score = 0;
    //console.log(ingredients);
    ingredients.forEach(function (el1) {
        recipe.ingredients.forEach(function (el2) {
            if (el1.ingredient.toLowerCase() === el2.ingredient.toLowerCase()) {
                score += 1;
            }
        });
    });

    return score;
}

/**
 * Find recipes containing one or multiple ingredients
 * @param {{ingredients: [String], maxTime: [Number]}} query 
 * @param {Function} callback 
 */
var findRecipeByIngredient = (query, callback) => {
    let ingredients = query.ingredients || [];
    let maxTime = query.maxTime || null;

    Recipe.find()
        .sort("title")
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

var findRecipeByID = (req, res, next) => {
    Recipe.findById(req.params.id, function(err, result) {
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
    findRecipeByID,
    insertRecipe,
    findStorageInfo,
    findContact,
    insertContact
};
