var mongoose = require('mongoose');
require('../../models/db');
var Recipe = mongoose.model('recipe');
var Ingredient = mongoose.model('ingredient');
var fs = require("fs");
var parser = require('recipe-ingredient-parser-v2');

var content = fs.readFileSync('data/recipes/taste-300-main-recipes.json');
recipes = JSON.parse(content);

recipeDocs = []

recipes.forEach(recipe => {
    i = recipe.ingredients.ingredientSections;
    formattedIngredients = i.map(a => {
        try {
            parsed = parser.parse(a.ingredient);
        }
        catch(e){
            console.log(e);
        }
        return {
            ingredient: a.parsedIngredient,
            text: a.ingredient,
            unit: parsed.unit,
            quantity: parsed.quantity,
        }
    });

    rec = recipe.recipe;
    notes = recipe.notes;
    var r = new Recipe({
        title: rec.name,
        method: rec.recipeInstructions,
        serves: rec.recipeYield,
        tags: rec.keywords,
        description: rec.description,
        author: rec.author.name,
        source: 'https:' + rec.mainEntityOfPage,
        image: rec.image.url,
        notes: notes,
        prepTime: rec.prepTime, // ISO 8601 Duration
        cookTime: rec.cookTime, // ISO 8601 Duration
        totalTime: rec.totalTime, // ISO 8601 Duration
        nutrition: {
            calories: rec.nutrition.calories,
            fatContent: rec.nutrition.fatContent,
            saturatedFatContent: rec.nutrition.saturatedFatContent,
            carbohydrateContent: rec.nutrition.carbohydrateContent,
            sugarContent: rec.nutrition.sugarContent,
            fibreContent: rec.nutrition.fibreContent,
            proteinContent: rec.nutrition.proteinContent,
            cholestrolContent: rec.nutrition.cholestrolContent,
            sodiumContent: rec.nutrition.sodiumContent
        },
        aggregateRating: {
            ratingCount: rec.aggregateRating.ratingCount,
            ratingValue: rec.aggregateRating.ratingValue
        },
        ingredients: formattedIngredients
    });
    recipeDocs.push(r);
});




process.exit();