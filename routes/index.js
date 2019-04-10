var express = require('express');
var path = require('path');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/index.html"), { title: "Home" });
});

/* GET ingredients page. */
router.get('/ingredients', function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/ingredients.html"), { title: "Ingredients" });
});

/* GET recipe page. */
router.get('/recipe', function (req, res, next) {
  res.sendFile(path.join(__dirname + "/../public/recipe.html"), { title: "Recipe" });
});

module.exports = router;
