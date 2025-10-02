import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Star, User, Calendar, Tag, ExternalLink } from 'lucide-react';

const ModCard = ({ mod, viewMode = 'grid', onDownload }) => {
  const formatDownloads = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
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

  if (viewMode === 'list') {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link to={`/mod/${mod.id}`} className="group-hover:text-blue-300 transition-colors">
                  <h3 className="text-xl font-semibold text-white mb-1">{mod.name}</h3>
                </Link>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{mod.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag size={14} />
                    <span>v{mod.version}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getCategoryColor(mod.category)} text-white`}>
                    {mod.category}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star size={16} />
                  <span className="text-sm">{mod.rating}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{mod.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Download size={14} />
                <span>{formatDownloads(mod.downloads_count)} downloads</span>
              </div>
              <div>Size: {mod.file_size || 'Unknown'}</div>
            </div>
          </div>
          
          <div className="ml-6 flex flex-col space-y-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onDownload();
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <Link
              to={`/mod/${mod.id}`}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center flex items-center space-x-1 justify-center"
            >
              <ExternalLink size={16} />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl">
      {/* Header with category gradient */}
      <div className={`h-2 bg-gradient-to-r ${getCategoryColor(mod.category)}`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link to={`/mod/${mod.id}`} className="group-hover:text-blue-300 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{mod.name}</h3>
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <User size={14} />
              <span>{mod.author}</span>
              <span>•</span>
              <span>v{mod.version}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star size={16} />
            <span className="text-sm">{mod.rating}</span>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{mod.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {mod.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {mod.tags.length > 3 && (
            <span className="px-2 py-1 text-gray-400 text-xs">
              +{mod.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Download size={14} />
            <span>{formatDownloads(mod.downloads_count)}</span>
          </div>
          <div>{mod.file_size || 'Unknown'}</div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onDownload();
            }}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
          <Link
            to={`/mod/${mod.id}`}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
          >
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModCard;