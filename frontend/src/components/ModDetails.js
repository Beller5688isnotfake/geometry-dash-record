import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Star, User, Calendar, Tag, ExternalLink, Shield, Clock } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModDetails = () => {
  const { modId } = useParams();
  const [mod, setMod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchMod();
  }, [modId]);

  const fetchMod = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/mods/${modId}`);
      setMod(response.data);
    } catch (error) {
      console.error('Error fetching mod:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!mod) return;
    
    try {
      setDownloading(true);
      const response = await axios.post(`${API}/mods/${mod.id}/download`);
      const { download_url, filename } = response.data;
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = download_url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Refresh mod data to update download count
      fetchMod();
    } catch (error) {
      console.error('Error downloading mod:', error);
    } finally {
      setDownloading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Visual Enhancement': 'from-pink-500 to-rose-500',
      'Interface': 'from-blue-500 to-cyan-500',
      'Gameplay': 'from-green-500 to-emerald-500',
      'Multiplayer': 'from-purple-500 to-violet-500',
      'Practice': 'from-yellow-500 to-orange-500',
      'Performance': 'from-red-500 to-pink-500',
      'Recording': 'from-indigo-500 to-purple-500',
      'Customization': 'from-teal-500 to-cyan-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading mod details...</p>
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Mod Not Found</h1>
          <p className="text-gray-300 mb-6">The mod you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Browse</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
            <div className={`h-1 bg-gradient-to-r ${getCategoryColor(mod.category)} rounded-full mb-6`}></div>
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{mod.name}</h1>
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>{mod.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag size={16} />
                    <span>v{mod.version}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getCategoryColor(mod.category)} text-white`}>
                    {mod.category}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-yellow-400 text-lg">
                <Star size={24} />
                <span className="font-semibold">{mod.rating}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed">{mod.description}</p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mod.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 text-sm rounded-full transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            {mod.compatibility && mod.compatibility.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Compatibility</h3>
                <div className="flex items-center space-x-2">
                  <Shield size={16} className="text-green-400" />
                  <span className="text-gray-300">
                    Geometry Dash {mod.compatibility.join(', ')}
                  </span>
                </div>
              </div>
            )}

            {/* Installation Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
                <Shield size={20} />
                <span>Installation Instructions</span>
              </h3>
              <ol className="text-gray-300 space-y-1 list-decimal list-inside">
                <li>Make sure you have <a href="https://geode-sdk.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Geode mod loader</a> installed</li>
                <li>Download the mod file (.geode)</li>
                <li>Place the .geode file in your Geometry Dash mods folder</li>
                <li>Launch Geometry Dash and enable the mod in Geode</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24">
            {/* Download Section */}
            <div className="mb-6">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2 mb-4"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Download Mod</span>
                  </>
                )}
              </button>
              
              <div className="text-center text-sm text-gray-400">
                Free • Safe • Virus Scanned
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Downloads</span>
                <span className="text-white font-medium">{mod.downloads_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">File Size</span>
                <span className="text-white font-medium">{mod.file_size || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <span className="text-white font-medium">{mod.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Version</span>
                <span className="text-white font-medium">v{mod.version}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-400" />
                  <span className="text-white font-medium">{mod.rating}/5</span>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="space-y-2">
              <a
                href="https://geode-sdk.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ExternalLink size={16} />
                <span>Get Geode Loader</span>
              </a>
              
              <a
                href="https://github.com/geode-sdk/geode"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ExternalLink size={16} />
                <span>Geode GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModDetails;