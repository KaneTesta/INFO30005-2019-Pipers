var express = require('express');
var recipeController = require("../controllers/recipeController");
var contactController = require("../controllers/contactController");
var userController = require("../controllers/userController");

var router = express.Router();

const THEME_COLOR = "#34a534";

function getOptions(req, title, viewport, data, callback) {
    if (req.session && req.session.passport && req.session.passport.user) {
        userController.findUser(req.session.passport.user, (msg) => {
            if (!msg.error && msg.result.length > 0) {
                callback({
                    title: title,
                    user: msg.result[0],
                    theme_color: THEME_COLOR,
                    viewport: viewport,
                    data: data
                });
            } else {
                callback({
                    title: title,
                    user: null,
                    theme_color: THEME_COLOR,
                    viewport: viewport,
                    data: data
                });
            }
        });
    } else {
        callback({
            title: title,
            user: null,
            theme_color: THEME_COLOR,
            viewport: viewport,
            data: data
        });
    }
}

/* GET home page. */
router.get('/', function (req, res, next) {
    getOptions(req, "Home", 0, null, (options) => {
        res.render('index', options);
    });
});

/* GET ingredients page. */
router.get('/ingredients', function (req, res, next) {
    getOptions(req, "Ingredients", 1, null, (options) => {
        res.render('ingredients', options);
    });
});

/* GET recipe page. */
router.get('/recipe', function (req, res, next) {
    let query = {
        "ingredients": req.query.ingredients || [],
        "priority_ingredients": req.query.priority_ingredients || [],
        "unavailable_cookware": req.query.ingredients || [],
        "maximum_time": parseInt(req.query.maximum_time) || 0,
    }

    let options = {
        page: req.query.page || 1,
        limit: req.query.limit || 5
    }

    // GET recipes from ingredients
    recipeController.findRecipeByIngredients(query, options, function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            getOptions(req, "Recipes", 2, { recipes: msg.result, page: req.query.page }, (options) => {
                res.render('recipe', options);
            });
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
            getOptions(req, msg.result.title, 3, {
                recipe: msg.result,
                url_back: req.query.q
            }, (options) => {
                res.render('recipe-step-1', options);
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
            getOptions(req, msg.result.title, 4, {
                recipe: msg.result,
                url_back: req.query.q
            }, (options) => {
                res.render('recipe-step-2', options);
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
            getOptions(req, msg.result.title, 5, {
                recipe: msg.result,
                url_back: req.query.q
            }, (options) => {
                res.render('recipe-step-3', options);
            });
        }
    });
});

/* GET contacts page. */
router.get('/contacts', function (req, res) {
    contactController.allContacts(function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            getOptions(req, "Contacts", 6, { users: msg.result }, (options) => {
                res.render('contacts', options);
            });
        }
    });
});

/* GET contacts page. */
router.get('/user', function (req, res) {
    contactController.allContacts(function (msg) {
        if (msg.error) {
            res.status(500).send(msg.error);
        } else {
            getOptions(req, "User", 6, { users: msg.result }, (options) => {
                res.render('user', options);
            });
        }
    });
});

router.get('/recipe/:id', recipeController.findRecipeByID);

module.exports = router;
