var mongoose = require('mongoose');
var Recipe = mongoose.model('recipe');
var Storage = mongoose.model('storage');

var ingredientController = require("./ingredientController");

var findRecipeByIngredients = (query, options, callback) => {
    if (callback === null || callback === undefined) {
        return;
    }

    if (query === null || query === undefined) {
        callback({
            error: "query cannot be null"
        });

        return;
    }

    Recipe.aggregatePaginate(Recipe.byQuery(query), options,
        (err, recipes, pageCount, count) => {
            callback({
                error: err,
                result: recipes,
                pageCount: pageCount,
                count: count,
            });
        }
    );
};

var findRecipeByID = (id, callback) => {
    Recipe.findById(id, function (err, result) {
        callback({
            error: err,
            result: result
        });
    })
}

// Insert one recipe
// Insert one recipe
const insertRecipe = (url, callback) => {
    request({
      method: 'GET',
      url,
    }, (err, res, body) => {
      const $ = cheerio.load(body);
  
      // Get recipe object
      let obj = $("script[type='application/ld+json']");
      const recipe = JSON.parse(obj[0].children[0].data);
  
      // Get ingredients object
      obj = $("script[type='application/json']");
      const recipeIngredients = JSON.parse(obj[0].children[0].data);
      // Parse ingredients
      const ingredients = recipeIngredients.ingredientSections.map((i) => {
        const parsed = parser.parse(i.ingredient);
  
        // Add new ingredients
        Ingredient.findOne({ name: i.parsedIngredient }, (iErr, iRes) => {
          if (!iErr) {
            if (!iRes) {
              const newIngredient = new Ingredient({
                name: i.parsedIngredient,
              });
              newIngredient.save();
            }
          }
        });
  
        return {
          ingredient: i.parsedIngredient,
          text: i.ingredient,
          unit: parsed.unit,
          quantity: parsed.quantity,
        };
      });
  
      // Get notes
      const notes = $('.recipe-notes > div').text().trim();
      // Get equipment
      const equipment = $('.equipment-description').text().trim();
  
      // Build recipe
      const recipeDoc = new Recipe({
        title: recipe.name,
        method: recipe.recipeInstructions,
        serves: recipe.recipeYield,
        tags: recipe.keywords,
        description: recipe.description,
        author: recipe.author.name,
        source: `https:${recipe.mainEntityOfPage}` || url,
        nutrition: recipe.nutrition,
        prepTime: moment.duration(recipe.prepTime).asMinutes(),
        cookTime: moment.duration(recipe.cookTime).asMinutes(),
        totalTime: moment.duration(recipe.totalTime).asMinutes(),
        aggregateRating: recipe.aggregateRating,
        image: recipe.image.url,
        notes,
        equipment,
        ingredients,
      });
      recipeDoc.save();
      callback({
        result: recipeDoc,
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

/**
 * Convert a recipe to a target serving size
 */
var convertRecipe = (recipe, targetSize) => {
    for (let i = 0; i < recipe.ingredients.length; ++i) {
        if (targetSize != recipe.serves) {
            recipe.ingredients[i].displayText = ingredientController.convertQuantity(
                recipe.ingredients[i], recipe.serves, targetSize
            );
        } else {
            recipe.ingredients[i].displayText = recipe.ingredients[i].text;
        }
    }
}


// Exporting callbacks
module.exports = {
    findRecipeByIngredients,
    findRecipeByID,
    insertRecipe,
    findStorageInfo,
    convertRecipe
};
