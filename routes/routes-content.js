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
        "ingredients": req.query.ingredients || [],
        "priority_ingredients": req.query.priority_ingredients || [],
        "unavailable_cookware": req.query.ingredients || [],
        "maximum_time": parseInt(req.query.maximum_time) || 0,
    }

    // GET recipes from ingredients
    recipeController.findRecipeByIngredients(query, function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            res.render('recipe', { title: "Recipe", theme_color: THEME_COLOR, viewport: 2, recipes: msg.result });
        }
    });
});

/* GET recipe step 1 page. */
router.get('/result/1/', function (req, res, next) {
    // GET recipe from id
    recipeController.findRecipeByID(req.query.id, function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            res.render('recipe-step-1', {
                title: msg.result.title,
                theme_color: THEME_COLOR,
                viewport: 3,
                recipe: msg.result,
                url_back: req.query.q
            });
        }
    });
});

/* GET recipe step 2 page. */
router.get('/result/2/', function (req, res, next) {
    // GET recipe from id
    recipeController.findRecipeByID(req.query.id, function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            res.render('recipe-step-2', {
                title: msg.result.title,
                theme_color: THEME_COLOR,
                viewport: 4,
                recipe: msg.result,
                url_back: req.query.q
            });
        }
    });
});

/* GET recipe step 3 page. */
router.get('/result/3/', function (req, res, next) {
    // GET recipe from id
    recipeController.findRecipeByID(req.query.id, function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            res.render('recipe-step-3', {
                title: msg.result.title,
                theme_color: THEME_COLOR,
                viewport: 5,
                recipe: msg.result,
                url_back: req.query.q
            });
        }
    });
});

router.get('/recipe/:id', recipeController.findRecipeByID);

module.exports = router;
