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
    // GET recipes from ingredients
    recipeController.findRecipeByIngredients(req.query.ingredients, function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            res.render('recipe', { title: "Recipe", theme_color: THEME_COLOR, viewport: 2, recipes: msg.result });
        }
    });
});

/* GET contacts page. */
router.get('/contacts', function (req, res) {
    res.render('contacts', { title: "Contacts", theme_color: THEME_COLOR, viewport: 1, users : [ {name: "Kane", number: "1234"}, {name: "Joel", number: "1234"}, {name: "Yousha", number: "1234"},{name: "John", number: "1234"}, {name: "James", number: "1234"}] });
});


router.get('/recipe/:id', recipeController.findRecipeByID);

module.exports = router;
