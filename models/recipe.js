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
  ingredients: {
    type: [String],
    required: [true, "Recipe needs ingredients"]
  },
  method: {
    type: [String],
    required: [true, "Recipe needs a method"]
  },
  author: String,
  serves: Number,
  cookware: {
    type: Map,
    of: Boolean
  },
  cooktime: Number // Minutes
});

recipeSchema.virtual('parsedIngredients').get(function() {
  return this.ingredients.map((i) => {
    return parser.parse(i);
  });
});

recipeSchema.virtual('url').get(function() {
  return "something" + this._id;
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
