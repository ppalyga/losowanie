const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//Konfiguracja mechanizmu losowania liczb
var currentNumber = null;
function generateRandomNumber() {
  return Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
}

// Routing
app.get('/', function(req, res) {
  res.render('index');
});

// Wygenerowanie losowej liczby
app.get('/losuj', function(req, res) {
  currentNumber = generateRandomNumber();
  res.json({
    number: currentNumber
  });
});

//Sprawdzenie, czy liczba podana przez klienta jest prawidłowa
app.post('/sprawdz', function(req, res) {
  var status = 2;
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
