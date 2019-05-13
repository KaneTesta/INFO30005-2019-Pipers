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

/*
  Returns an array of recipes using the ingredients given, delimited by '+'
  Example:
  /api/recipes/ingredient1+ingredient2
  /api/recipes/Chicken+Tomato
 */

router.get('/recipes/:ingredients', (req, res) => {
  const query = {
    ingredients: req.params.ingredients.split('+'),
  };

  controller.findRecipeByIngredients(query, (msg) => { sendResponse(msg, res); });
});

/*
  Adds a recipe to the collection, accepts json object in the format defined in
  ../models/recipe
*/

router.post('/recipes', (req, res) => {
  controller.insertRecipe(req.body, (msg) => { sendResponse(msg, res); });
});

/*
  Returns how to store a given ingredient
  Accepts any part of an ingredient name

  Examples:
  /api/storage/Apples
  /api/storage/apple
  /api/storage/appl

  for the item "Apples"
*/

router.get('/storage/:ingredient', controller.findStorageInfo);

/*
  A multi-use route

  A get request will take the query params and search the Contacts collection
  for that contact, if none is provided, will list all items in the collection
  Examples:
  /api/contacts?name=Alex
  returns the matching contact
  /api/contacts
  returns all contacts

  A put request accepts a json object as the body in the format defined in
  ../models/contacts
  and adds it to the contacts collection
*/

router
  .route('/contacts')

  .get(contactController.findContact)

  .post(contactController.insertContact);

router.get('/contacts/all', contactController.allContacts);
router.delete('/contacts/:id', contactController.deleteContact);

/*
TODO
Note, all of these routes have used different methods of collecting input to interact with the database,
we should decide on one single method of passing info around to unify our backend, making it easier to
incorporate with the frontend
*/

router.get('/ingredients', ingredientController.getIngredients);

router.post('/user/saveingredients', (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    userController.saveIngredients(req, (msg) => { sendResponse(msg, res); });
  } else {
    res.status(500).send('User not logged in');
  }
});

router.post('/user/delete', (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const user_id = req.session.passport.user;
    userController.deleteUser(user_id, (msg) => { sendResponse(msg, res); });
  } else {
    res.status(500).send('User not logged in');
  }
});

router.post('/user/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Error logging out');
    } else {
      res.send('Logged out');
    }
  });
});

module.exports = router;
