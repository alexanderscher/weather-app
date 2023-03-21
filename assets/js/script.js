var apiKey = "1791efc900804a415be233a50a04e460";
var city = "Los Angeles";
var cityEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

fetch(cityEndpoint)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data[0].lat);
    console.log(data[0].lon);

    var lon = data[0].lon;
    var lat = data[0].lat;
    var todayEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    var forecastEndpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(todayEndpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var temp = data.main.temp;
        var humidity = data.main.humidity;
        var wind = data.wind.speed;
        console.log(temp, humidity, wind);
      });

    fetch(forecastEndpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var checkedDates = [];
        data.list.forEach(function (x) {
          var dates = x.dt_txt.split(" ");
          var temp = x.main.temp;
          var humidity = x.main.humidity;
          var wind = x.wind.speed;

          if (checkedDates.includes(dates[0])) {
          } else {
            checkedDates.push(dates[0]);
            console.log(dates[0], temp, humidity, wind);
          }
        });
      });
  });

// temp;
// wind;
// humidity;
