var express = require('express');
var router = express.Router();
var cors = require('cors');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Books' });
});
app.get('/without-cors', (req, res, next) => {
  res.json({msg: 'Works! 🎉'})
})

app.get('/with-cors', cors(), (req, res, next) => {
  res.json({msg: 'Works! 🎉'})
})

module.exports = router;
