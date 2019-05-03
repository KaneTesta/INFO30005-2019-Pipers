var mongoose = require('mongoose');
var parser = require('recipe-ingredient-parser-v2');
var pluralize = require('pluralize');

//TODO
// Search by quantities of ingredients
// Search by recipe time
// Search by cookware
// Search by serves
// Combine ingredients from multiple recipes

var recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Recipe needs a title"],
    trim: true,
    minlength: 1
  },
  method: {
    type: [String],
    required: [true, "Recipe needs a method"]
  },
  serves: Number,
  tags: [String],
  description: String,
  author: String,
  source: String,
  image: String,
  notes: String,
  prepTime: Number,
  cookTime: Number,
  totalTime: Number,
  nutrition: {
    calories: String,
    fatContent: String,
    saturatedFatContent: String,
    carbohydrateContent: String,
    sugarContent: String,
    fibreContent: String,
    proteinContent: String,
    cholestrolContent: String,
    sodiumContent: String
  },
  aggregateRating: {
    ratingCount: Number,
    ratingValue: Number
  },
  ingredients: {
    type: Array,
    required: [true, "Recipe needs ingredients"]
  }
});


recipeSchema.virtual('url').get(function () {
  return "/recipe/" + this._id;
});

/**
 * Search recipes including given ingredients
 * Yields the recipes containing those ingredients, sorted by matches
 * 
 * TODO: paginate (https://www.npmjs.com/package/mongoose-aggregate-paginate)
 * 
 * @param {string[]} i Array of ingredients
 */
recipeSchema.statics.byIngredients = function (i) {
  return this.aggregate([
    {
      $addFields: {
        matches: {
          $setIntersection: [i, { $map: { input: "$ingredients", as: "ingredient", in: "$$ingredient.ingredient" } }]
        }
      }
    },
    {
      $addFields: {
        totalMatch: {
          $size: "$matches"
        }
      }
    },
    {
      $sort: {
        totalMatch: -1
      }
    },
    {
      $project: {
        totalMatch: 0
      }
    }
  ])
}

/* recipeSchema.query.byIngredient = function (ingredients) {
  return this
    .where('ingredients')
    .and(ingredients.map((ing) => {
      cleanedIngredient = ing.toLowerCase().trim();
      return {
        ingredients: {
          $elemMatch: {
            ingredient: cleanedIngredient
          }
        }
      }
    }));
} */

recipeSchema.query.sortByRating = function () {
  return this.sort({ 'aggregateRating.ratingValue': -1 });
}

recipeSchema.query.byServes = function (min, max) {
  return this.where('serves').gte(min).lte(max);
}

recipeSchema.query.byMaximumTime = function (max) {
  return this.where('totalTime').lte(max);
}

mongoose.model('recipe', recipeSchema, 'recipes');
