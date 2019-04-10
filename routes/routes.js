const express = require('express');
const router = express.Router();

const controller = require('../controllers/controllers');

router.get('/', function (req, res) {
  res.send('The Pied Pipers');
});

router.get('/ingredient/:ingredient', controller.findRecipeByIngredient);

router.get('/storage/:ingredient', controller.findStorageInfo);

router.get('/contacts', controller.showContactInfo)

module.exports = router;