var express = require('express');
var path = require('path');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: "Home" });
});

/* GET ingredients page. */
router.get('/ingredients', function (req, res, next) {
  res.render('ingredients', { title: "Ingredients" });
});

/* GET recipe page. */
router.get('/recipe', function (req, res, next) {
  res.render('recipe', { title: "Recipe" });
});

module.exports = router;
