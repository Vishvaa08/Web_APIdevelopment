require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const City = require('./models/City');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// GET cities with optional filters: ?search=lon&sort=asc
app.get('/api/cities', async (req, res) => {
  const { search, sort } = req.query;

  let filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' }; // case-insensitive
  }

  let query = City.find(filter);

  if (sort === 'asc') {
    query = query.sort({ name: 1 });
  } else if (sort === 'desc') {
    query = query.sort({ name: -1 });
  }

  const cities = await query.exec();
  res.json(cities);
});

// DELETE city
app.delete('/api/cities/:id', async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: 'City deleted' });
  } catch (err) {
    res.status(500).json({ error: 'City not found or delete failed' });
  }
});

// POST new city
app.post('/api/cities', async (req, res) => {
  const { name } = req.body;
  const city = new City({ name });
  await city.save();
  res.json(city);
});

// GET weather for a city (third-party API)
app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
