'use strict';

const express = require('express');

require('dotenv').config();

let data = require('./data/weather.json');

const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;


// test the server
app.get('/', (request, response) => {
  response.send('Server is working!');
});

// request format: http://localhost:3002/city?cityName=Seattle
app.get('/city', (request, response, next) => {
  try {
    let cityRequested = request.query.cityName;
    let cityObject = data.find(city => city.city_name === cityRequested);
    let selectedCity = new City(cityObject);
    response.send(selectedCity);
  } catch (error) {
    next(error);
  }
});

app.get('*', (request, response) => {
  response.send('The resource does not exist');
});

class City {
  constructor(CityObject) {
    this.city_name = CityObject.city_name;
  }
}

// class Forecast {
//   constructor
// }

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
