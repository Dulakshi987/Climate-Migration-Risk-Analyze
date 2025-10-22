const mongoose = require('mongoose');

const migrationRiskSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  city: String,
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  factors: {
    climateRisk: Number,
    economicImpact: Number,
    populationDensity: Number,
    vulnerabilityIndex: Number
  },
  recommendations: [String],
  calculatedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('MigrationRisk', migrationRiskSchema);