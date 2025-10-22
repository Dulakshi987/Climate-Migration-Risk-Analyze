import React, { useState } from 'react';
import { riskAPI } from '../services/api';
import { AlertTriangle, Calculator, MapPin, TrendingUp } from 'lucide-react';

const RiskAssessment = () => {
  const [formData, setFormData] = useState({
    city: '',
    country: ''
  });
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRiskData(null);

    try {
      const response = await riskAPI.calculateRisk(formData);
      setRiskData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error calculating risk assessment');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      'Low': 'from-green-500 to-green-600',
      'Moderate': 'from-yellow-500 to-yellow-600',
      'High': 'from-orange-500 to-orange-600',
      'Critical': 'from-red-500 to-red-600'
    };
    return colors[level] || colors['Low'];
  };

  const getRiskBorderColor = (level) => {
    const colors = {
      'Low': 'border-green-500',
      'Moderate': 'border-yellow-500',
      'High': 'border-orange-500',
      'Critical': 'border-red-500'
    };
    return colors[level] || colors['Low'];
  };

  const getProgressColor = (score) => {
    if (score >= 75) return 'bg-red-500';
    if (score >= 50) return 'bg-orange-500';
    if (score >= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Risk Assessment</h1>
          <p className="text-gray-600">Calculate climate-induced migration risk for any location</p>
        </div>

        {/* Assessment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Calculate Risk Score</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Colombo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sri Lanka"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Climate data must exist for this location. Please fetch climate data first from the Climate Analysis page.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>{loading ? 'Calculating...' : 'Calculate Risk Assessment'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Risk Assessment Results */}
        {riskData && (
          <div className="space-y-6">
            {/* Main Risk Score Card */}
            <div className={`bg-gradient-to-r ${getRiskColor(riskData.riskLevel)} rounded-lg shadow-xl p-8 text-white`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">
                      {riskData.city}, {riskData.country}
                    </h2>
                  </div>
                  <p className="text-sm opacity-90">
                    Assessment Date: {new Date(riskData.calculatedDate).toLocaleString()}
                  </p>
                </div>
                <AlertTriangle className="w-16 h-16 opacity-80" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm opacity-90 mb-2">Overall Risk Score</p>
                  <p className="text-6xl font-bold mb-2">{riskData.riskScore}<span className="text-2xl">/100</span></p>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mb-2">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${riskData.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm opacity-90 mb-2">Risk Level</p>
                    <div className="bg-white text-gray-800 px-8 py-4 rounded-lg">
                      <p className="text-4xl font-bold">{riskData.riskLevel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Risk Factors Breakdown</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Climate Risk */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Climate Risk</span>
                    <span className="text-sm font-bold text-gray-800">{riskData.factors.climateRisk}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getProgressColor(riskData.factors.climateRisk)}`}
                      style={{ width: `${riskData.factors.climateRisk}%` }}
                    ></div>
                  </div>
                </div>

                {/* Economic Impact */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Economic Impact</span>
                    <span className="text-sm font-bold text-gray-800">{riskData.factors.economicImpact}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getProgressColor(riskData.factors.economicImpact)}`}
                      style={{ width: `${riskData.factors.economicImpact}%` }}
                    ></div>
                  </div>
                </div>

                {/* Population Density */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Population Density</span>
                    <span className="text-sm font-bold text-gray-800">{riskData.factors.populationDensity}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getProgressColor(riskData.factors.populationDensity)}`}
                      style={{ width: `${riskData.factors.populationDensity}%` }}
                    ></div>
                  </div>
                </div>

                {/* Vulnerability Index */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Vulnerability Index</span>
                    <span className="text-sm font-bold text-gray-800">{riskData.factors.vulnerabilityIndex}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getProgressColor(riskData.factors.vulnerabilityIndex)}`}
                      style={{ width: `${riskData.factors.vulnerabilityIndex}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${getRiskBorderColor(riskData.riskLevel)}`}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                {riskData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-700 flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessment;