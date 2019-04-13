const express = require('express');
const router = express.Router();

const controller = require('../controllers/controllers');

router.get('/', function (req, res) {
  res.send('The Pied Pipers');
});

router.get('/api/recipes/:ingredients', controller.findRecipeByIngredient);

router.post('/api/recipes', controller.insertRecipe)

router.get('/api/storage/:ingredient', controller.findStorageInfo);

router.route('/api/contacts')

  .get(controller.showContactInfo)

  .post(controller.insertContact)

module.exports = router;
