const express = require('express');
const router = express.Router();

const controller = require('../controllers/controllers');

router.get('/', function (req, res) {
  res.send('The Pied Pipers');
});

router.get('/api/recipes', controller.findRecipeByIngredient);

router.get('/api/storage/:ingredient', controller.findStorageInfo);

router.route('/api/contacts')

  .get(controller.showContactInfo)

  .post(controller.createContact)

module.exports = router;
