const axios = require('axios');
const ClimateData = require('../models/ClimateData');

exports.getClimateData = async (req, res) => {
  try {
    const { city, country } = req.query;
    
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }
    
    // OpenWeatherMap API call
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    const weatherResponse = await axios.get(weatherUrl);
    const data = weatherResponse.data;
    
    const climateData = {
      country: country || data.sys.country,
      city: city,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.['1h'] || 0,
      seaLevel: data.main.sea_level || 0,
      extremeEvents: Math.floor(Math.random() * 5), // Simulated
      airQuality: Math.floor(Math.random() * 100), // Simulated
      dataDate: new Date()
    };
    
    // Save to database
    const savedData = await ClimateData.create(climateData);
    
    res.json({
      message: 'Climate data retrieved successfully',
      data: savedData
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching climate data', 
      error: error.message 
    });
  }
};

exports.getHistoricalData = async (req, res) => {
  try {
    const { country, city, startDate, endDate } = req.query;
    
    const query = {};
    if (country) query.country = country;
    if (city) query.city = city;
    if (startDate && endDate) {
      query.dataDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const data = await ClimateData.find(query).sort({ dataDate: -1 }).limit(100);
    
    res.json({
      message: 'Historical data retrieved',
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};