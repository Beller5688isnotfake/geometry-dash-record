import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Star, Users } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⬢</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GD ModHub</h1>
              <p className="text-xs text-gray-300 hidden sm:block">Geometry Dash Mods</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <Download size={16} />
                <span>135k+ Downloads</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} />
                <span>50+ Mods</span>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
              Submit Mod
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;