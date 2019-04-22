var express = require('express');
var path = require('path');

var router = express.Router();

const THEME_COLOR = "#34a534";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: "Home", theme_color: THEME_COLOR, viewport: 0 });
});

/* GET ingredients page. */
router.get('/ingredients', function (req, res, next) {
  res.render('ingredients', { title: "Ingredients", theme_color: THEME_COLOR, viewport: 1 });
});

/* GET recipe page. */
router.get('/recipe', function (req, res, next) {
  res.render('recipe', { title: "Recipe", theme_color: THEME_COLOR, viewport: 2 });
});

module.exports = router;
