const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

var currentNumber = 0;
function generateRandomNumber() {
  return Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
}

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/losuj', function(req, res) {
  currentNumber = generateRandomNumber();
  res.json({
    number: currentNumber
  });
});

app.post('/sprawdz', function(req, res) {
  var status = 2;
  console.log(currentNumber);
  if (req.body.number < currentNumber) {
    status = 0;
  } else if (req.body.number > currentNumber) {
    status = 1;
  }

  res.json({
    status: status
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
