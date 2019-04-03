const express = require('express');
const router = express.Router();

const controller = require('../controllers/controllers');

router.get('/', function (req, res) {
  res.send('The Pied Pipers');
});


module.exports = router;
