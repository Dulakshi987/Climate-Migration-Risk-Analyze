const MigrationRisk = require('../models/MigrationRisk');
const ClimateData = require('../models/ClimateData');
const riskCalculator = require('../utils/riskCalculator');
const axios = require('axios');

exports.calculateRisk = async (req, res) => {
  try {
    const { country, city } = req.body;
    
    // Get latest climate data
    const climateData = await ClimateData.findOne({ country, city })
      .sort({ dataDate: -1 });
    
    if (!climateData) {
      return res.status(404).json({ 
        message: 'No climate data found. Please fetch climate data first.' 
      });
    }
    
    // Get population data from REST Countries API
    let population = 1000000; // Default
    try {
      const countryResponse = await axios.get(
        `https://restcountries.com/v3.1/name/${country}`
      );
      population = countryResponse.data[0]?.population || 1000000;
    } catch (err) {
      console.log('Could not fetch population data, using default');
    }
    
    // Calculate risk
    const riskAnalysis = riskCalculator.calculateMigrationRisk(
      climateData, 
      population
    );
    
    const recommendations = riskCalculator.getRecommendations(
      riskAnalysis.riskLevel
    );
    
    // Save risk assessment
    const riskAssessment = await MigrationRisk.create({
      country,
      city,
      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      factors: riskAnalysis.factors,
      recommendations,
      calculatedDate: new Date()
    });
    
    res.json({
      message: 'Risk assessment completed',
      data: riskAssessment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRiskAssessments = async (req, res) => {
  try {
    const { country, city, riskLevel } = req.query;
    
    const query = {};
    if (country) query.country = country;
    if (city) query.city = city;
    if (riskLevel) query.riskLevel = riskLevel;
    
    const assessments = await MigrationRisk.find(query)
      .sort({ calculatedDate: -1 })
      .limit(50);
    
    res.json({
      message: 'Risk assessments retrieved',
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const stats = await MigrationRisk.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 },
          avgScore: { $avg: '$riskScore' }
        }
      }
    ]);
    
    const totalAssessments = await MigrationRisk.countDocuments();
    
    res.json({
      message: 'Statistics retrieved',
      totalAssessments,
      byRiskLevel: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};