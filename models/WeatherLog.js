const mongoose = require('mongoose');

const WeatherLogSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherLog', WeatherLogSchema);