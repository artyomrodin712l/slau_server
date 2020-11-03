var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  xk = [0.78,0.99, 1.05]
  res.json(xk)
  console.log(req.body);
});

module.exports = router;