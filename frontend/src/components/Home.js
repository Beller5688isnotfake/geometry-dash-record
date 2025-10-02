import React, { useState, useEffect } from 'react';
import { Search, Download, Star, Filter, Grid, List } from 'lucide-react';
import axios from 'axios';
import ModCard from './ModCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [mods, setMods] = useState([]);
  const [filteredMods, setFilteredMods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterMods();
  }, [mods, searchTerm, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [modsRes, categoriesRes, statsRes] = await Promise.all([
        axios.get(`${API}/mods`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/stats`)
      ]);
      
      setMods(modsRes.data);
      setCategories(categoriesRes.data.categories);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMods = () => {
    let filtered = mods;

    if (searchTerm) {
      filtered = filtered.filter(mod => 
        mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(mod => mod.category === selectedCategory);
    }

    setFilteredMods(filtered);
  };

  const handleDownload = async (modId) => {
    try {
      const response = await axios.post(`${API}/mods/${modId}/download`);
      const { download_url, filename } = response.data;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = download_url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Refresh mods to update download count
      fetchData();
    } catch (error) {
      console.error('Error downloading mod:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading mods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
          Geometry Dash Mods
        </h1>
        <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
          Discover and download the best mods for Geometry Dash. Enhance your gameplay with visual improvements, new features, and quality-of-life updates.
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-300 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>{stats.total_mods} Total Mods</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>{stats.total_downloads?.toLocaleString()} Downloads</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>{stats.categories_count} Categories</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'border-white/10 text-gray-300 hover:bg-white/5'
                }`}
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>
              
              {selectedCategory && (
                <div className="flex items-center space-x-2 bg-purple-600/20 border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-purple-300">
                  <span>{selectedCategory}</span>
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="text-purple-400 hover:text-purple-200"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'border-white/10 text-gray-300 hover:bg-white/5'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'border-white/10 text-gray-300 hover:bg-white/5'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <FilterPanel 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {/* Mods Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            {selectedCategory ? `${selectedCategory} Mods` : 'All Mods'} 
            <span className="text-gray-400 ml-2">({filteredMods.length})</span>
          </h2>
        </div>
        
        {filteredMods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No mods found matching your criteria.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredMods.map((mod) => (
              <ModCard 
                key={mod.id} 
                mod={mod} 
                viewMode={viewMode}
                onDownload={() => handleDownload(mod.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;