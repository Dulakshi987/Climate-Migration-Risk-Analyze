class RiskCalculator {
  /**
   * Calculate climate risk based on climate data
   */
  calculateClimateRisk(climateData) {
    let score = 0;
    
    // Temperature risk (extreme heat or cold)
    if (climateData.temperature > 35) {
      score += 25; // Very high temperature
    } else if (climateData.temperature > 30) {
      score += 15; // High temperature
    } else if (climateData.temperature < 0) {
      score += 10; // Freezing temperature
    } else if (climateData.temperature < 5) {
      score += 5; // Very cold
    }
    
    // Humidity risk
    if (climateData.humidity > 80) {
      score += 15; // Very humid
    } else if (climateData.humidity > 70) {
      score += 10; // Humid
    } else if (climateData.humidity < 20) {
      score += 10; // Very dry
    } else if (climateData.humidity < 30) {
      score += 5; // Dry
    }
    
    // Rainfall anomaly risk
    if (climateData.rainfall > 200) {
      score += 20; // Extreme rainfall
    } else if (climateData.rainfall > 100) {
      score += 15; // Heavy rainfall
    } else if (climateData.rainfall < 10 && climateData.rainfall > 0) {
      score += 15; // Drought conditions
    } else if (climateData.rainfall === 0) {
      score += 10; // No rainfall
    }
    
    // Sea level risk (if applicable)
    if (climateData.seaLevel > 0) {
      score += Math.min(climateData.seaLevel * 2, 15);
    }
    
    // Extreme weather events risk
    if (climateData.extremeEvents) {
      score += Math.min(climateData.extremeEvents * 5, 25);
    }
    
    // Air quality risk
    if (climateData.airQuality) {
      if (climateData.airQuality > 150) {
        score += 15; // Unhealthy
      } else if (climateData.airQuality > 100) {
        score += 10; // Moderate to unhealthy
      } else if (climateData.airQuality > 50) {
        score += 5; // Moderate
      }
    }
    
    // Cap the score at 100
    return Math.min(score, 100);
  }

  /**
   * Calculate overall migration risk
   */
  calculateMigrationRisk(climateData, population = 1000000) {
    // Calculate individual risk factors
    const climateRisk = this.calculateClimateRisk(climateData);
    
    // Economic impact (simplified calculation)
    // Higher climate risk = higher economic impact
    const economicImpact = Math.min(
      (climateRisk * 0.6) + (Math.random() * 20) + 10,
      100
    );
    
    // Population density risk
    // Higher population = higher migration pressure
    const populationDensity = Math.min((population / 10000), 50);
    
    // Vulnerability index (combination of climate and economic factors)
    const vulnerabilityIndex = (climateRisk * 0.5) + (economicImpact * 0.5);
    
    // Calculate weighted total risk score
    const totalRisk = 
      (climateRisk * 0.40) +           // 40% weight
      (economicImpact * 0.30) +        // 30% weight
      (populationDensity * 0.15) +     // 15% weight
      (vulnerabilityIndex * 0.15);     // 15% weight
    
    return {
      riskScore: Math.round(totalRisk),
      riskLevel: this.getRiskLevel(totalRisk),
      factors: {
        climateRisk: Math.round(climateRisk),
        economicImpact: Math.round(economicImpact),
        populationDensity: Math.round(populationDensity),
        vulnerabilityIndex: Math.round(vulnerabilityIndex)
      }
    };
  }

  /**
   * Determine risk level based on score
   */
  getRiskLevel(score) {
    if (score >= 75) {
      return 'Critical';
    } else if (score >= 50) {
      return 'High';
    } else if (score >= 25) {
      return 'Moderate';
    } else {
      return 'Low';
    }
  }

  /**
   * Get recommendations based on risk level
   */
  getRecommendations(riskLevel) {
    const recommendations = {
      'Critical': [
        'Immediate evacuation planning required',
        'Establish emergency shelters and safe zones',
        'Deploy disaster response teams',
        'International aid coordination needed',
        'Emergency food and water distribution systems',
        'Medical emergency preparedness'
      ],
      'High': [
        'Monitor situation closely with real-time updates',
        'Prepare evacuation routes and transport',
        'Stockpile emergency supplies',
        'Community awareness and training programs',
        'Strengthen critical infrastructure',
        'Establish early warning systems'
      ],
      'Moderate': [
        'Strengthen infrastructure for climate resilience',
        'Implement climate adaptation measures',
        'Deploy early warning systems',
        'Community preparedness training',
        'Develop sustainable water management',
        'Create climate action plans'
      ],
      'Low': [
        'Regular monitoring of climate indicators',
        'Preventive maintenance measures',
        'Climate resilience building programs',
        'Sustainable development focus',
        'Community education on climate change',
        'Long-term adaptation planning'
      ]
    };
    
    return recommendations[riskLevel] || recommendations['Low'];
  }

  /**
   * Analyze trend based on historical data
   */
  analyzeTrend(historicalData) {
    if (!historicalData || historicalData.length < 2) {
      return 'Insufficient data';
    }

    const scores = historicalData.map(data => 
      this.calculateClimateRisk(data)
    );

    const recentAvg = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;

    if (recentAvg > olderAvg + 10) {
      return 'Increasing';
    } else if (recentAvg < olderAvg - 10) {
      return 'Decreasing';
    } else {
      return 'Stable';
    }
  }

  /**
   * Get severity description
   */
  getSeverityDescription(score) {
    if (score >= 90) {
      return 'Extreme - Catastrophic conditions';
    } else if (score >= 75) {
      return 'Critical - Severe threat to population';
    } else if (score >= 60) {
      return 'High - Major concerns for safety';
    } else if (score >= 40) {
      return 'Moderate - Notable climate impacts';
    } else if (score >= 20) {
      return 'Low - Minor climate concerns';
    } else {
      return 'Minimal - Stable conditions';
    }
  }
}


