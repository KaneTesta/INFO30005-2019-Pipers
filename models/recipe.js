var mongoose = require('mongoose');
var parser = require('recipe-ingredient-parser-v2');

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
  prepTime: String, // ISO 8601 Duration
  cookTime: String, // ISO 8601 Duration
  totalTime: String, // ISO 8601 Duration
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


recipeSchema.virtual('url').get(function() {
  return "/recipe/" + this._id;
});

recipeSchema.query.byIngredient = function(ingredients) {
  return this.where('ingredients').all(ingredients.map((i) => {
    return new RegExp(i, 'i');
  }));
};

recipeSchema.query.byServes = function(min, max) {
  return this.where('serves').gte(min).lte(max);
}

recipeSchema.query.byMaximumTime = function(max) {
  return this.where('cooktime').lte(max);
}

mongoose.model('recipe', recipeSchema, 'recipes');
