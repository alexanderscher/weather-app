var apiKey = "1791efc900804a415be233a50a04e460";
var city = "Los Angeles";
var cityEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

var cit = document.querySelector("#city");
var weath = document.querySelector("#weather");
var tem = document.querySelector("#temperature");
var humid = document.querySelector("#humidity");
var win = document.querySelector("#wind-speed");
var forecast = document.querySelector(".forecast");

fetch(cityEndpoint)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var lon = data[0].lon;
    var lat = data[0].lat;
    var todayEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    var forecastEndpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(todayEndpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var kelvin = data.main.temp;
        var temp = Math.round((kelvin - 273.15) * 9) / 5 + 32;
        var city = `${data.name}, ${data.sys.country}`;
        var humidity = data.main.humidity;
        var wind = Math.round(data.wind.speed * 2.2369362920544);
        var weatherType = data.weather[0].main;

        cit.innerHTML = city;
        weath.innerHTML = weatherType;
        tem.innerHTML = temp + "°F";
        humid.innerHTML = humidity + "%";
        win.innerHTML = wind + "mph";

        todayWeather = {
          city: city,
          temp: temp,
          humidity: humidity,
          wind: wind,
        };
        localStorage.setItem("today", JSON.stringify(todayWeather));
      });

    fetch(forecastEndpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var checkedDates = [];
        var storage = [];

        data.list.forEach(function (x) {
          var dates = x.dt_txt.split(" ");
          var kelvin = x.main.temp;
          var temp = Math.round((kelvin - 273.15) * 9) / 5 + 32;
          var humidity = x.main.humidity;
          var wind = Math.round(x.wind.speed * 2.2369362920544);
          var weatherType = x.weather[0].main;

          if (checkedDates.includes(dates[0])) {
          } else {
            checkedDates.push(dates[0]);

            forecastStorage = {
              date: dates[0],
              temp: temp,
              humidity: humidity,
              wind: wind,
              weatherType: weatherType,
            };

            storage.push(forecastStorage);

            var outDiv = document.createElement("div");
            var inDiv = document.createElement("div");
            outDiv.className = "forecast-data";

            var dateF = document.createElement("p");
            var tempF = document.createElement("p");
            var humF = document.createElement("p");
            var windF = document.createElement("p");
            var weathF = document.createElement("p");

            dateF.innerHTML = "Date: " + dates[0];
            weathF.innerHTML = "Weather: " + weatherType;
            tempF.innerHTML = "Temp: " + temp + "°F";
            humF.innerHTML = "Humidity: " + humidity + "%";
            windF.innerHTML = "Wind-Speed: " + wind + "mph";

            inDiv.append(dateF);
            inDiv.append(weathF);
            inDiv.append(tempF);
            inDiv.append(humF);
            inDiv.append(windF);

            outDiv.append(inDiv);
            forecast.append(outDiv);
          }
          localStorage.setItem("forecast", JSON.stringify(storage));
        });
      });
  });
