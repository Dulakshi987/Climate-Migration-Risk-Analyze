import React, { useState, useEffect } from 'react';
import { riskAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Activity, TrendingUp } from 'lucide-react';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [statsRes, assessmentsRes] = await Promise.all([
        riskAPI.getStatistics(),
        riskAPI.getAssessments({})
      ]);
      
      setStats(statsRes.data);
      setAssessments(assessmentsRes.data.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare data for charts
  const riskLevelData = stats?.byRiskLevel?.map(item => ({
    name: item._id,
    count: item.count,
    avgScore: Math.round(item.avgScore)
  })) || [];

  const COLORS = {
    'Low': '#10b981',
    'Moderate': '#f59e0b',
    'High': '#f97316',
    'Critical': '#ef4444'
  };

  const pieData = riskLevelData.map(item => ({
    name: item.name,
    value: item.count
  }));

  // Top 10 locations by risk score
  const topRisks = [...assessments]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10)
    .map(item => ({
      location: `${item.city}, ${item.country}`,
      score: item.riskScore,
      level: item.level
    }));

  // Timeline data (last 30 assessments)
  const timelineData = [...assessments]
    .sort((a, b) => new Date(a.calculatedDate) - new Date(b.calculatedDate))
    .slice(-30)
    .map((item, index) => ({
      index: index + 1,
      score: item.riskScore,
      date: new Date(item.calculatedDate).toLocaleDateString()
    }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Statistics & Analytics</h1>
          <p className="text-gray-600">Comprehensive overview of climate migration risk data</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <Activity className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Total Assessments</p>
            <p className="text-3xl font-bold">{stats?.totalAssessments || 0}</p>
          </div>

          {['Critical', 'High', 'Moderate'].map((level) => {
            const data = riskLevelData.find(item => item.name === level);
            const colors = {
              'Critical': 'from-red-500 to-red-600',
              'High': 'from-orange-500 to-orange-600',
              'Moderate': 'from-yellow-500 to-yellow-600'
            };
            
            return (
              <div key={level} className={`bg-gradient-to-br ${colors[level]} rounded-lg shadow-lg p-6 text-white`}>
                <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90 mb-1">{level} Risk Areas</p>
                <p className="text-3xl font-bold">{data?.count || 0}</p>
                <p className="text-xs opacity-75 mt-1">Avg Score: {data?.avgScore || 0}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Level Distribution Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Risk Level Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Count" />
                <Bar dataKey="avgScore" fill="#8b5cf6" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Level Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <PieChartIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Risk Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Score Timeline */}
        {timelineData.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Risk Score Timeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" label={{ value: 'Assessment #', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-300 rounded shadow">
                          <p className="text-sm font-medium">Score: {payload[0].value}</p>
                          <p className="text-xs text-gray-600">{payload[0].payload.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Risk Locations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Top 10 High-Risk Locations</h2>
          {topRisks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {topRisks.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{item.score}</p>
                      <p className="text-xs text-gray-500">Risk Score</p>
                    </div>
                    <div className="w-20">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.score >= 75 ? 'bg-red-500' :
                            item.score >= 50 ? 'bg-orange-500' :
                            item.score >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;