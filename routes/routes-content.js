var express = require('express');
var path = require('path');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: "Home", viewport: 0 });
});

/* GET ingredients page. */
router.get('/ingredients', function (req, res, next) {
  res.render('ingredients', { title: "Ingredients", viewport: 1 });
});

/* GET recipe page. */
router.get('/recipe', function (req, res, next) {
  res.render('recipe', { title: "Recipe", viewport: 2 });
});

module.exports = router;
