var assert = require('assert');
var mongoose = require('mongoose');
require('../models/db');

var recipeController = require('../controllers/recipeController');

describe('Recipe', function () {
    describe('/recipe', function () {
        it('null query should give error', function () {
            recipeController.findRecipeByIngredients(null, function (msg) {
                assert(msg.error);
            });
        });

        it('non-array ingredients should give error', function () {
            let query = {
                ingredients: "5"
            };

            recipeController.findRecipeByIngredients(query, function (msg) {
                assert(msg.error);
            });
        });

        it('non-array priority should give error', function () {
            let query = {
                ingredients: ["Tomato"],
                ingredients_priority: "a"
            };

            recipeController.findRecipeByIngredients(query, function (msg) {
                assert(msg.error);
            });
        });
    });
});

mongoose.disconnect();
