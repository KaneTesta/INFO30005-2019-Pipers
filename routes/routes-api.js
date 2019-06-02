const express = require('express');
const router = express.Router();

const controller = require('../controllers/recipeController');
const ingredientController = require('../controllers/ingredientController');
const contactController = require('../controllers/contactController');
const userController = require('../controllers/userController');

/**
 * 
 * @param {{error, result}} msg 
 * @param {Response} res 
 */
function sendResponse(msg, res) {
  if (msg.error) {
    res.status(500).send(msg.error);
  } else {
    res.json(msg.result);
  }
}

router.get('/', (req, res) => {
  res.send('The Pied Pipers');
});


router.get('/ingredients', ingredientController.getIngredients);
router.get('/ingredient/:name', ingredientController.getIngredientInfo);

router.post('/user/saveingredients', function (req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    userController.saveIngredients(req, function (msg) { sendResponse(msg, res); });
  } else {
    res.status(500).send("User not logged in");
  }
});

router.post('/user/delete', function (req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    let user_id = req.session.passport.user;
    userController.deleteUser(user_id, function (msg) { sendResponse(msg, res); });
  } else {
    res.status(500).send("User not logged in");
  }
});

router.post('/user/logout', function (req, res) {
  req.logout();
  req.session.destroy(function (err) {
    if (err) {
      res.status(500).send("Error logging out");
    } else {
      res.send("Logged out");
    }
  });
});

module.exports = router;
