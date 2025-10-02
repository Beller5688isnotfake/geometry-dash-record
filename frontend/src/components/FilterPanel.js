import React from 'react';
import { Filter } from 'lucide-react';

const FilterPanel = ({ categories, selectedCategory, onCategoryChange }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Visual Enhancement': 'border-pink-500 text-pink-300 hover:bg-pink-500/10',
      'Interface': 'border-blue-500 text-blue-300 hover:bg-blue-500/10',
      'Gameplay': 'border-green-500 text-green-300 hover:bg-green-500/10',
      'Multiplayer': 'border-purple-500 text-purple-300 hover:bg-purple-500/10',
      'Practice': 'border-yellow-500 text-yellow-300 hover:bg-yellow-500/10',
      'Performance': 'border-red-500 text-red-300 hover:bg-red-500/10',
      'Recording': 'border-indigo-500 text-indigo-300 hover:bg-indigo-500/10',
      'Customization': 'border-teal-500 text-teal-300 hover:bg-teal-500/10',
    };
    return colors[category] || 'border-gray-500 text-gray-300 hover:bg-gray-500/10';
  };

  const getSelectedCategoryColor = (category) => {
    const colors = {
      'Visual Enhancement': 'bg-pink-500/20 border-pink-400 text-pink-200',
      'Interface': 'bg-blue-500/20 border-blue-400 text-blue-200',
      'Gameplay': 'bg-green-500/20 border-green-400 text-green-200',
      'Multiplayer': 'bg-purple-500/20 border-purple-400 text-purple-200',
      'Practice': 'bg-yellow-500/20 border-yellow-400 text-yellow-200',
      'Performance': 'bg-red-500/20 border-red-400 text-red-200',
      'Recording': 'bg-indigo-500/20 border-indigo-400 text-indigo-200',
      'Customization': 'bg-teal-500/20 border-teal-400 text-teal-200',
    };
    return colors[category] || 'bg-gray-500/20 border-gray-400 text-gray-200';
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Filter size={20} className="text-white" />
        <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
            selectedCategory === ''
              ? 'bg-white/20 border-white/40 text-white'
              : 'border-white/20 text-gray-300 hover:bg-white/10'
          }`}
        >
          All Categories
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
              selectedCategory === category
                ? getSelectedCategoryColor(category)
                : getCategoryColor(category)
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Select a category to filter mods, or browse all available mods.</p>
      </div>
    </div>
  );
};

export default FilterPanel;