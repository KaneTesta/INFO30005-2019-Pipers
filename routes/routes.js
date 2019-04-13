const express = require('express');
const router = express.Router();

const controller = require('../controllers/controllers');

router.get('/', function (req, res) {
  res.send('The Pied Pipers');
});

/* 
  Returns an array of recipes using the ingredients given, delimited by '+'
  Example:
  /api/recipes/ingredient1+ingredient2
 */

router.get('/api/recipes/:ingredients', controller.findRecipeByIngredient);


/*
  Adds a recipe to the collection, accepts json object in the format defined in
  ../models/recipe
*/

router.post('/api/recipes', controller.insertRecipe)


/*
  Returns how to store a given ingredient
  Accepts any part of an ingredient name

  Examples:
  /api/storage/Apples
  /api/storage/apple
  /api/storage/appl

  for the item "Apples"
*/

router.get('/api/storage/:ingredient', controller.findStorageInfo);


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

router.route('/api/contacts')

  .get(controller.findContact)

  .post(controller.insertContact)

/*
TODO
Note, all of these routes have used different methods of collecting input to interact with the database, we should decide on one single method of passing info around to unify our backend, making it easier to incorporate with the frontend
*/

module.exports = router;
