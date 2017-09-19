$(document).ready(function() {
  $('button:first-of-type').click(function(e) {
    $(e.target).prop('disabled', true);

    $.ajax({
      type: 'GET',
      url: '/losuj',
      success: function(data) {
        $('textarea').val(
          'SERWER: Połączenie ustanowione, wylosowano liczbę. Jaka to liczba?'
        );

        var min = 1;
        var max = 10000;

        function generateNumber(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var numberToCheck = generateNumber(min, max);
        var getNumberStatus = null;

        function checkStatus(numberToCheck) {
          $.ajax({
            type: 'POST',
            url: '/sprawdz',
            data: {
              number: numberToCheck
            },
            success: function(data) {
              $('textarea').val(
                $('textarea').val() +
                  '\nKLIENT: Czy wylosowana liczba to ' +
                  numberToCheck +
                  '?'
              );

              if (data.status === 0) {
                $('textarea').val(
                  $('textarea').val() +
                    '\nSERWER: Wylosowana liczba jest większa.'
                );

                min = numberToCheck + 1;
                numberToCheck = generateNumber(min, max);

                checkStatus(numberToCheck);
              } else if (data.status === 1) {
                $('textarea').val(
                  $('textarea').val() +
                    '\nSERWER: Wylosowana liczba jest mniejsza.'
                );

                max = numberToCheck - 1;
                numberToCheck = generateNumber(min, max);

                checkStatus(numberToCheck);
              } else if (data.status === 2) {
                $('textarea').val(
                  $('textarea').val() + '\nSERWER: Zgadłeś! To ta liczba.'
                );
              }
            },
            error: function() {
              console.log('Wystąpił błąd w połączeniu :(');
            }
          });
        }

        checkStatus(numberToCheck);
      },
      error: function() {
        console.log('Wystąpił błąd w połączeniu :(');
      }
    });
  });

  $('button:nth-of-type(2)').click(function() {
    $('textarea').val('');

    $('button:first-of-type').prop('disabled', false);
  });
});
