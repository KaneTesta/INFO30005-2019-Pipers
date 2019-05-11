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
  ingredients: [{
    quantity: Number,
    unit: String,
    ingredient: mongoose.Schema.ObjectId
  }],
  method: {
    type: [String],
    required: [true, "Recipe needs a method"]
  },
  author: String,
  serves: Number,
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

/**
 * Search recipes including given ingredients
 * Yields the recipes containing those ingredients, sorted by matches
 * 
 * TODO: paginate (https://www.npmjs.com/package/mongoose-aggregate-paginate)
 * 
 * @param {{ingredients: [String], priority_ingredients: [String], unavailable_cookware: [String], maximum_time: number}} query Array of ingredients
 */
recipeSchema.statics.byQuery = function (query) {
  if (!query.maximum_time) {
    query.maximum_time = Number.MAX_SAFE_INTEGER;
  }

  return this.aggregate([
    {
      $match: {
        "totalTime": { $lte: query.maximum_time }
      }
    },
    {
      $addFields: {
        hasPriorityIngredients: {
          $setIsSubset: [query.priority_ingredients, {
            $map: { input: "$ingredients", as: "ingredient", in: "$$ingredient.ingredient" }
          }]
        }
      }
    },
    {
      $match: {
        "hasPriorityIngredients": true
      }
    },
    {
      $addFields: {
        matches: {
          $setIntersection: [query.ingredients, {
            $map: { input: "$ingredients", as: "ingredient", in: "$$ingredient.ingredient" }
          }]
        },
        matches_priority: {
          $setIntersection: [query.priority_ingredients, {
            $map: { input: "$ingredients", as: "ingredient", in: "$$ingredient.ingredient" }
          }]
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
      $match: {
        "totalMatch": { $gte: 1 }
      }
    },
    {
      $sort: {
        totalMatch: -1
      },
    },
    {
      $project: {
        hasPriorityIngredients: 0,
        totalMatch: 0
      }
    }
  ])
}

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
