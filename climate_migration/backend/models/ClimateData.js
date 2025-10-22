const mongoose = require('mongoose');

const climateDataSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  temperature: Number,
  humidity: Number,
  rainfall: Number,
  seaLevel: Number,
  extremeEvents: Number,
  airQuality: Number,
  dataDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ClimateData', climateDataSchema);