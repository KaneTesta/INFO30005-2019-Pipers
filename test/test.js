var assert = require('assert');
var mongoose = require('mongoose');

require('../models/db');
var recipeController = require('../controllers/recipeController');

try {
    describe('Recipe', function () {
        describe('/recipe', function () {
            it('null query should give error', function () {
                recipeController.findRecipeByIngredients(null, null, function (msg) {
                    assert(msg.error);
                });
            });

            it('non-array ingredients should give error', function () {
                let query = {
                    ingredients: "5"
                };

                recipeController.findRecipeByIngredients(query, null, function (msg) {
                    assert(msg.error);
                });
            });

            it('non-array priority should give error', function () {
                let query = {
                    ingredients: ["Tomato"],
                    ingredients_priority: "a"
                };

                recipeController.findRecipeByIngredients(query, null, function (msg) {
                    assert(msg.error);
                });
            });
        });
    });
} catch {
    // Error
    console.log("Errors occured during testing");
}

mongoose.disconnect(function () {
    console.log("Database disconnected");
    process.exit();
});
