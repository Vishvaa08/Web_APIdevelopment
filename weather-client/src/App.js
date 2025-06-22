import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cities');
      setCities(res.data);
    } catch (err) {
      console.error('Error fetching cities', err);
    }
  };

  const addCity = async () => {
    if (!cityName) return;
    try {
      await axios.post('http://localhost:5000/api/cities', { name: cityName });
      setCityName('');
      fetchCities();
    } catch (err) {
      console.error('Error adding city', err);
    }
  };

  const getWeather = async (name) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/weather/${name}`);
      setWeather(res.data);
    } catch (err) {
      console.error('Error fetching weather', err);
    }
  };

  const deleteCity = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cities/${id}`);
      fetchCities();
    } catch (err) {
      console.error('Error deleting city', err);
    }
  };

  return (
    <div className="container">
      <h1>Weather App</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCity();
        }}
      >
        <input
          type="text"
          placeholder="Enter city name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <button type="submit">Add City</button>
      </form>

      <div className="city-list">
        {cities.map((city) => (
          <div key={city._id} className="city-card">
            <span>{city.name}</span>
            <div>
              <button onClick={() => getWeather(city.name)}>Get Weather</button>
              <button style={{ marginLeft: '8px' }} onClick={() => deleteCity(city._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {weather && (
        <div className="city-card" style={{ marginTop: '20px', background: '#e0f7fa' }}>
          <strong>Weather in {weather.name}:</strong><br />
          {weather.weather[0].main} - {weather.weather[0].description}<br />
          Temperature: {weather.main.temp}°C<br />
          Humidity: {weather.main.humidity}%
        </div>
      )}
    </div>
  );
}

export default App;
