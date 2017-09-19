$(document).ready(function() {
  // Zablokowanie możliwości ponownego uruchomienia aplikacji przed zakoczeniem jej działania
  $('button:first-of-type').click(function(e) {
    $(e.target).prop('disabled', true);

    // Żądanie wylosowania liczby przez serwer
    $.ajax({
      type: 'GET',
      url: '/losuj',
      success: function(data) {
        $('textarea').val(
          'SERWER: Połączenie ustanowione, wylosowano liczbę. Jaka to liczba?'
        );

        //Konfiguracja aktualnego zakresu i generowania zgadywanych liczb
        function generateNumber(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var min = 1,
          max = 10000,
          numberToCheck = generateNumber(min, max);

        // Funkcja wysyłająca żądanie do serwera o sprawdzenie poprawności liczby
        function checkStatus(numberToCheck) {
          $('textarea').val(
            $('textarea').val() +
              '\nKLIENT: Czy wylosowana liczba to ' +
              numberToCheck +
              '?'
          );

          $.ajax({
            type: 'POST',
            url: '/sprawdz',
            data: {
              number: numberToCheck
            },
            success: function(data) {
              if (data.status === 0) {
                $('textarea').val(
                  $('textarea').val() +
                    '\nSERWER: Wylosowana liczba jest większa.'
                );
                // Zmiana zakresu generowanych liczb
                min = numberToCheck + 1;
                numberToCheck = generateNumber(min, max);
                checkStatus(numberToCheck);
              } else if (data.status === 1) {
                $('textarea').val(
                  $('textarea').val() +
                    '\nSERWER: Wylosowana liczba jest mniejsza.'
                );
                // Zmiana zakresu generowanych liczb
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
              $('textarea').val('Wystąpił błąd w połączeniu z serwerem');
            }
          });
        }

        checkStatus(numberToCheck);
      },
      error: function() {
        $('textarea').val('Wystąpił błąd w połączeniu z serwerem');
      }
    });
  });

  //   Reset stanu aplikacji
  $('button:nth-of-type(2)').click(function() {
    $('textarea').val('');
    $('button:first-of-type').prop('disabled', false);
  });
});
