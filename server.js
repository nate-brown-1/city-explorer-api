'use strict';


// express (server package)
const express = require('express');

//  environmental variable package / for API tokens
require('dotenv').config();

// weather data file, not from API
let data = require('./data/weather.json');

// cross origin resource sharing = allows JavaScript clients
const cors = require('cors');

// assign variable to express
const app = express();

// start cors
app.use(cors());

// get port number from .env / using 3001
// when express is started
// if .env is correct, will show as "Listening on 3001"
// if .env is broken/missing, will show as "Listening on 3002"
const PORT = process.env.PORT || 3002;

// test the server
app.get('/', (request, response) => {
  response.send('Server is working!');
});

// request format: http://localhost:3001/city?cityName=Seattle
// weatherbit request format: https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
app.get('/city', (request, response, next) => {
  try {
    let cityRequested = request.query.cityName;

    // let weatherResults = async (e) => {
    //   await axios.get(`request`);
    // }
    let cityResults = data.find(city => city.city_name === cityRequested);
    let forecast = cityResults.data.map(fc => new Forecast(fc));
    response.send(forecast);
  } catch (error) {
    next(error);
  }
});

app.get('*', (request, response) => {
  response.send('The resource does not exist');
});

class Forecast {
  constructor(ForecastObject) {
    this.date = ForecastObject.valid_date;
    this.description = `low of ${ForecastObject.low_temp}, high of ${ForecastObject.high_temp}, with ${ForecastObject.weather.description.toLowerCase()}`
  }
}

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
