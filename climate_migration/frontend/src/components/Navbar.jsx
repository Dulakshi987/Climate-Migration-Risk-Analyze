import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Cloud, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Cloud className="w-8 h-8" />
            <span>Climate Migration Risk Analysis</span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-blue-200 transition">
                Dashboard
              </Link>
              <Link to="/analysis" className="hover:text-blue-200 transition">
                Climate Analysis
              </Link>
              <Link to="/risk" className="hover:text-blue-200 transition">
                Risk Assessment
              </Link>
              <Link to="/statistics" className="hover:text-blue-200 transition flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span>Statistics</span>
              </Link>
              
              <div className="flex items-center space-x-4 border-l border-blue-400 pl-4">
                <span className="text-sm">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;