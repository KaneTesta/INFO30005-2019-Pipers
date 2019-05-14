const express = require('express');
const recipeController = require('../controllers/recipeController');
const contactController = require('../controllers/contactController');
const userController = require('../controllers/userController');

const router = express.Router();

const THEME_COLOR = '#34a534';

function getOptions(req, title, viewport, data, callback) {
  if (req.session && req.session.passport && req.session.passport.user) {
    userController.findUser(req.session.passport.user, (msg) => {
      if (!msg.error && msg.result.length > 0) {
        callback({
          title,
          user: msg.result[0],
          theme_color: THEME_COLOR,
          viewport,
          data,
        });
      } else {
        callback({
          title,
          user: null,
          theme_color: THEME_COLOR,
          viewport,
          data,
        });
      }
    });
  } else {
    callback({
      title,
      user: null,
      theme_color: THEME_COLOR,
      viewport,
      data,
    });
  }
}

/* GET home page. */
router.get('/', (req, res, next) => {
  getOptions(req, 'Home', 0, null, (options) => {
    res.render('index', options);
  });
});

/* GET ingredients page. */
router.get('/ingredients', (req, res, next) => {
  getOptions(req, 'Ingredients', 1, null, (options) => {
    res.render('ingredients', options);
  });
});

/* GET recipe page. */
router.get('/recipe', (req, res, next) => {
  const query = {
    ingredients: req.query.ingredients || [],
    priority_ingredients: req.query.priority_ingredients || [],
    unavailable_cookware: req.query.ingredients || [],
    maximum_time: parseInt(req.query.maximum_time) || 0,
  };

  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 5,
  };

  // GET recipes from ingredients
  recipeController.findRecipeByIngredients(query, options, (msg) => {
    if (msg.error) {
      res.status(500).send(msg.error);
    } else {
      getOptions(req, 'Recipes', 2, { recipes: msg.result }, (options) => {
        res.render('recipe', options);
      });
    }
  });
});

/* GET recipe step 1 page. */
router.get('/result/1/', (req, res, next) => {
  // GET recipe from id
  recipeController.findRecipeByID(req.query.id, (msg) => {
    if (msg.error) {
      res.status(500).send(msg.error);
    } else {
      getOptions(req, msg.result.title, 3, {
        recipe: msg.result,
        url_back: req.query.q,
      }, (options) => {
        res.render('recipe-step-1', options);
      });
    }
  });
});

/* GET recipe step 2 page. */
router.get('/result/2/', (req, res, next) => {
  // GET recipe from id
  recipeController.findRecipeByID(req.query.id, (msg) => {
    if (msg.error) {
      res.status(500).send(msg.error);
    } else {
      getOptions(req, msg.result.title, 4, {
        recipe: msg.result,
        url_back: req.query.q,
      }, (options) => {
        res.render('recipe-step-2', options);
      });
    }
  });
});

/* GET recipe step 3 page. */
router.get('/result/3/', (req, res, next) => {
  // GET recipe from id
  recipeController.findRecipeByID(req.query.id, (msg) => {
    if (msg.error) {
      res.status(500).send(msg.error);
    } else {
      getOptions(req, msg.result.title, 5, {
        recipe: msg.result,
        url_back: req.query.q,
      }, (options) => {
        res.render('recipe-step-3', options);
      });
    }
  });
});

/* GET contacts page. */
router.get('/contacts', (req, res) => {
  contactController.allContacts((msg) => {
    if (msg.error) {
      res.status(500).send(msg.error);
    } else {
      getOptions(req, 'Contacts', 6, { users: msg.result }, (options) => {
        res.render('contacts', options);
      });
    }
  });
});

/* GET contacts page. */
router.get('/user', (req, res) => {
  contactController.allContacts((msg) => {
    if (msg.error) {
      res.status(500).send(msg.error);
    } else {
      getOptions(req, 'User', 6, { users: msg.result }, (options) => {
        res.render('user', options);
      });
    }
  });
});

router.get('/recipe/:id', recipeController.findRecipeByID);

router.post('/recipe/add', (req, res, next) => {
  recipeController.insertRecipe(req.body.url, (msg) => {
    if (msg.error) {
      res.status(500).send(msg.error);
    } else {
      res.render('success');
    }
  });
});

module.exports = router;
