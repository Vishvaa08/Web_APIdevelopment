const express = require('express');
const axios = require('axios');
const WeatherLog = require('../models/WeatherLog');
const router = express.Router();
const apiKey = process.env.API_KEY;

router.post('/log', async (req, res) => {
  const { city } = req.body;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const temperature = response.data.main.temp;
    const newLog = new WeatherLog({ city, temperature });
    await newLog.save();
    res.json(newLog);
  } catch (err) {
    res.status(500).json({ error: 'City not found or API error' });
  }
});

router.get('/logs', async (req, res) => {
  const logs = await WeatherLog.find().sort({ date: -1 });
  res.json(logs);
});

module.exports = router;