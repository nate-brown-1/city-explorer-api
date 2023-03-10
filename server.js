'use strict';

// express (server package)
const express = require('express');

//  environmental variable package / for API tokens
require('dotenv').config();

// weather data file, not from API
let data = require('./data/weather.json');

// cross origin resource sharing = allows JavaScript clients
const cors = require('cors');

// use axios for remote API calls
const axios = require('axios');

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

// request format: http://localhost:3001/city?lat=$LAT&lon=$LON
app.get('/city', async (request, response, next) => {
  try {
    let cityLat = request.query.lat;
    let cityLon = request.query.lon;
    let forecast = await weatherbitRequest(cityLat, cityLon);
    console.log(forecast);
    response.send(forecast);
    }
  catch (error) {
    next(error);
  }
});

// weatherbit request format: http://api.weatherbit.io/v2.0/forecast/daily?lat=35.7796&lon=-78.6382&key=API_KEY

// let weatherbitRequestURL = 'http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}'

async function weatherbitRequest(lat, lon) {
  // local variable for weather request
  let w;
  try {
    w = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`);
    let forecast = w.data.data.map(fc => new Forecast(fc));
    // console.log(forecast);
    return Promise.resolve(forecast);
  } catch (e) {
    w = error.msg;
    console.log(w);
  }
}

let error = {
  msg: 'It looks like I picked the wrong week to quit amphetamines.'
}

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
