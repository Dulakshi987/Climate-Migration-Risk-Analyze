import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { riskAPI } from '../services/api';
import { AlertTriangle, TrendingUp, MapPin, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, assessmentsRes] = await Promise.all([
        riskAPI.getStatistics(),
        riskAPI.getAssessments({})
      ]);
      
      setStats(statsRes.data);
      setRecentAssessments(assessmentsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800 border-green-300',
      'Moderate': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'High': 'bg-orange-100 text-orange-800 border-orange-300',
      'Critical': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[level] || colors['Low'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of climate migration risk assessments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats?.totalAssessments || 0}
                </p>
              </div>
              <Activity className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {stats?.byRiskLevel?.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{item._id} Risk</p>
                  <p className="text-2xl font-bold text-gray-800">{item.count}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Avg: {item.avgScore.toFixed(1)}
                  </p>
                </div>
                <AlertTriangle className={`w-10 h-10 ${
                  item._id === 'Critical' ? 'text-red-600' :
                  item._id === 'High' ? 'text-orange-600' :
                  item._id === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/analysis" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1">
            <TrendingUp className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Climate Analysis</h3>
            <p className="text-blue-100">Fetch and analyze current climate data</p>
          </Link>

          <Link to="/risk" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1">
            <AlertTriangle className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
            <p className="text-purple-100">Calculate migration risk scores</p>
          </Link>

          <Link to="/statistics" className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1">
            <MapPin className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-2">View Statistics</h3>
            <p className="text-green-100">Detailed analytics and trends</p>
          </Link>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Risk Assessments</h2>
          </div>
          <div className="p-6">
            {recentAssessments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No assessments yet. Start by analyzing climate data.
              </p>
            ) : (
              <div className="space-y-4">
                {recentAssessments.map((assessment) => (
                  <div key={assessment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {assessment.city}, {assessment.country}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(assessment.calculatedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(assessment.riskLevel)}`}>
                        {assessment.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Score: {assessment.riskScore}/100</span>
                      <span>Climate: {assessment.factors.climateRisk}</span>
                      <span>Economic: {assessment.factors.economicImpact}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;