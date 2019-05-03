var express = require('express');
var recipeController = require("../controllers/recipeController");

var router = express.Router();

const THEME_COLOR = "#34a534";

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: "Home", theme_color: THEME_COLOR, viewport: 0 });
});

/* GET ingredients page. */
router.get('/ingredients', function (req, res, next) {
    res.render('ingredients', { title: "Ingredients", theme_color: THEME_COLOR, viewport: 1 });
});

/* GET recipe page. */
router.get('/recipe', function (req, res, next) {
    let query = {
        ingredients: req.query.ingredients.split(',').map((el) => {
            let ingredientParts = el.split('^');
            return {
                ingredient: ingredientParts[0].replace("%20", " "),
                quantity: ingredientParts[1]
            }
        }),
        maxTime: parseInt(req.query.maximum_time)
    };

    // GET recipes from ingredients
    recipeController.findRecipeByIngredients(req.query.ingredients, function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            res.render('recipe', { title: "Recipe", theme_color: THEME_COLOR, viewport: 2, recipes: msg.result });
        }
    });
});

router.get('/recipe/:id', recipeController.findRecipeByID);

module.exports = router;
