const mongoose = require('mongoose');
require('../../models/db');

const Recipe = mongoose.model('recipe');
const Ingredient = mongoose.model('ingredient');
const fs = require('fs');
const parser = require('recipe-ingredient-parser-v2');
const moment = require('moment');
const pluralize = require('pluralize');


/* Recipe
    .find()
    .exec(
        function (err, res) {
            if (!err) {
                res.map(recipe => {
                    recipe.ingredients.map(i => {
                        console.log(i.ingredient)
                    })
                })
            }
            else {
                console.log(err);
            }
            process.exit();
        }
    ) */

/* Ingredient.find().exec(function (err, res) {
    if (!err) {
        res.forEach ((i) => {
            p = i.name;
            s = pluralize.singular(i.name);
            if (p !== s) {
                console.log(p);
                console.log(s);
            }
        })
    }
    else {
        console.log(err);
    }
    process.exit();
}) */


const content = fs.readFileSync('data/recipes/taste-300-main-recipes.json');
recipes = JSON.parse(content);

recipeDocs = [];

recipes.forEach((recipe) => {
  i = recipe.ingredients.ingredientSections;
  formattedIngredients = i.map((a) => {
    try {
      parsed = parser.parse(a.ingredient);
    } catch (e) {
      console.log(e);
    }
    iregex = new RegExp(`^${a.parsedIngredient}`, 'i');
    Ingredient.findOne({ name: { $regex: iregex } }, (err, res) => {
      if (!err) {
        if (!res) {
          newIngredient = new Ingredient({
            name: a.parsedIngredient,
          });
          newIngredient.save();
          console.log(newIngredient);
        }
      } else {
        console.log(err);
      }
    });
    return {
      ingredient: a.parsedIngredient,
      text: a.ingredient,
      unit: parsed.unit,
      quantity: parsed.quantity,
    };
  });

  rec = recipe.recipe;
  notes = recipe.notes;
  const r = new Recipe({
    title: rec.name,
    method: rec.recipeInstructions,
    serves: rec.recipeYield,
    tags: rec.keywords,
    description: rec.description,
    author: rec.author.name,
    source: `https:${rec.mainEntityOfPage}`,
    image: rec.image.url,
    notes,
    prepTime: moment.duration(rec.prepTime).asMinutes(),
    cookTime: moment.duration(rec.cookTime).asMinutes(),
    totalTime: moment.duration(rec.totalTime).asMinutes(),
    nutrition: {
      calories: rec.nutrition.calories,
      fatContent: rec.nutrition.fatContent,
      saturatedFatContent: rec.nutrition.saturatedFatContent,
      carbohydrateContent: rec.nutrition.carbohydrateContent,
      sugarContent: rec.nutrition.sugarContent,
      fibreContent: rec.nutrition.fibreContent,
      proteinContent: rec.nutrition.proteinContent,
      cholestrolContent: rec.nutrition.cholestrolContent,
      sodiumContent: rec.nutrition.sodiumContent,
    },
    aggregateRating: {
      ratingCount: rec.aggregateRating.ratingCount,
      ratingValue: rec.aggregateRating.ratingValue,
    },
    ingredients: formattedIngredients,
  });
  recipeDocs.push(r);
});

Recipe.insertMany((recipeDocs), (err, docs) => {
  if (!err) {
    console.log('done');
  } else {
    console.log(err);
  }
});
