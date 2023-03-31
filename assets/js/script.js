var apiKey = "1791efc900804a415be233a50a04e460";

var cit = document.querySelector("#city");
var weath = document.querySelector("#weather");
var tem = document.querySelector("#temperature");
var humid = document.querySelector("#humidity");
var win = document.querySelector("#wind-speed");
var forecast = document.querySelector(".forecast");
var date = document.querySelector("#date");
var button = document.querySelector("button");
var input = document.querySelector("input");
var current = document.querySelector(".current-weather");
var weatherIcon = document.getElementById("weather-icon");
var recent = document.querySelector(".recent-searches");
var pastCities = document.querySelector(".past-cities");
var past = [];

function dayAppend(city, today, weatherType, temp, humidity, wind) {
  cit.innerHTML = city;
  date.innerHTML = today;
  weath.innerHTML = weatherType;
  tem.innerHTML = temp + "°F";
  humid.innerHTML = humidity + "%";
  win.innerHTML = wind + "mph";

  var type = weatherType.toLowerCase();
  weatherIcon.className = `wi wi-day-${weatherType.toLowerCase()}`;
}

function forecastAppend(temp, humidity, wind, weatherType, reformattedDate) {
  var outDiv = document.createElement("div");
  var inDiv = document.createElement("div");
  outDiv.className = "forecast-data";
  var dateF = document.createElement("p");
  var tempF = document.createElement("p");
  var humF = document.createElement("p");
  var windF = document.createElement("p");
  var weathF = document.createElement("p");
  dateF.innerHTML = "Date: " + reformattedDate;
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

  var icon = document.createElement("div");
  icon.className = "weather-icons";

  var i = document.createElement("i");
  i.id = "weather-icon";

  i.className = `wi wi-day-${weatherType.toLowerCase()}`;
  icon.append(i);
  outDiv.append(icon);
  forecast.append(outDiv);
}

function pastSearch(city) {
  past.push(city);
  var p = document.createElement("button");
  p.className = "past-cities";
  p.innerHTML = city;
  recent.append(p);

  p.addEventListener("click", () => {
    getCity(city);
  });
}

function getCity(input) {
  var cityEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=${apiKey}`;
  fetch(cityEndpoint)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var lon = data[0].lon;
      var lat = data[0].lat;
      var todayEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      fetch(todayEndpoint)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          var kelvin = data.main.temp;
          var temp = Math.round((kelvin - 273.15) * 9) / 5 + 32;
          var city = `${data.name}, ${data.sys.country}`;
          var humidity = data.main.humidity;
          var wind = Math.round(data.wind.speed * 2.2369362920544);
          var weatherType = data.weather[0].main;
          var today = dayjs().format("MM-DD-YYYY");

          pastSearch(city);

          todayWeather = {
            date: today,
            city: city,
            temp: temp,
            humidity: humidity,
            wind: wind,
            weatherType: weatherType,
          };

          localStorage.setItem("past", JSON.stringify(past));
          localStorage.setItem("today", JSON.stringify(todayWeather));

          dayAppend(city, today, weatherType, temp, humidity, wind);
        });

      var forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      forecast.innerHTML = "";
      fetch(forecastEndpoint)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          var checkedDates = [];
          var storage = [];

          index = 0;

          data.list.forEach((x) => {
            var dates = x.dt_txt.split(" ");
            var kelvin = x.main.temp;
            var temp = Math.round((kelvin - 273.15) * 9) / 5 + 32;
            var humidity = x.main.humidity;
            var wind = Math.round(x.wind.speed * 2.2369362920544);
            var weatherType = x.weather[0].main;

            if (checkedDates.includes(dates[0])) {
            } else {
              if (index < 5) {
                index++;
                checkedDates.push(dates[0]);
                var date = dayjs(dates[0]);
                var reformattedDate = date.format("MM-DD-YYYY");
                forecastAppend(
                  temp,
                  humidity,
                  wind,
                  weatherType,
                  reformattedDate
                );

                forecastStorage = {
                  date: reformattedDate,
                  temp: temp,
                  humidity: humidity,
                  wind: wind,
                  weatherType: weatherType,
                  city: input,
                };
                storage.push(forecastStorage);
              }
              localStorage.setItem("forecast", JSON.stringify(storage));
            }
          });
        });
    });
}

function getStorage() {
  todayStorage = JSON.parse(localStorage.getItem("today"));
  if (todayStorage !== null) {
    dayAppend(
      todayStorage.city,
      todayStorage.date,
      todayStorage.weatherType,
      todayStorage.temp,
      todayStorage.humidity,
      todayStorage.wind
    );
  }
  forecastStorage = JSON.parse(localStorage.getItem("forecast"));
  if (forecastStorage !== null) {
    forecastStorage.forEach(function (x) {
      forecastAppend(x.temp, x.humidity, x.wind, x.weatherType, x.date, x.city);
    });
  }
  pastSt = JSON.parse(localStorage.getItem("past"));
  if (pastSt !== null) {
    pastSt.forEach(function (x) {
      pastSearch(x);
    });
  }
}

function search(event) {
  event.preventDefault();
  getCity(input.value);
}

button.addEventListener("click", search);

getStorage();
