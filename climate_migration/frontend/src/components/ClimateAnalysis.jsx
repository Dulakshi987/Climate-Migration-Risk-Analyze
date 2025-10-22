import React, { useState } from 'react';
import { climateAPI } from '../services/api';
import { Search, Cloud, Droplets, Wind, Thermometer } from 'lucide-react';

const ClimateAnalysis = () => {
  const [formData, setFormData] = useState({
    city: '',
    country: ''
  });
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setClimateData(null);

    try {
      const response = await climateAPI.getCurrentData(formData.city, formData.country);
      setClimateData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching climate data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Climate Data Analysis</h1>
          <p className="text-gray-600">Fetch real-time climate data for any location</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
                  Country (Optional)
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sri Lanka"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Fetching Data...' : 'Fetch Climate Data'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Climate Data Display */}
        {climateData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {climateData.city}, {climateData.country}
              </h2>
              <p className="text-sm text-gray-500">
                Data recorded: {new Date(climateData.dataDate).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Thermometer className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Temperature</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">{climateData.temperature}°C</p>
              </div>

              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Droplets className="w-6 h-6 text-cyan-600" />
                  <h3 className="font-semibold text-gray-800">Humidity</h3>
                </div>
                <p className="text-3xl font-bold text-cyan-600">{climateData.humidity}%</p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Cloud className="w-6 h-6 text-indigo-600" />
                  <h3 className="font-semibold text-gray-800">Rainfall</h3>
                </div>
                <p className="text-3xl font-bold text-indigo-600">{climateData.rainfall} mm</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Wind className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Air Quality</h3>
                </div>
                <p className="text-3xl font-bold text-purple-600">{climateData.airQuality}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Cloud className="w-6 h-6 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Sea Level</h3>
                </div>
                <p className="text-3xl font-bold text-orange-600">{climateData.seaLevel} m</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Cloud className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-gray-800">Extreme Events</h3>
                </div>
                <p className="text-3xl font-bold text-red-600">{climateData.extremeEvents}</p>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This data has been stored in the database and can be used for risk assessment calculations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateAnalysis;