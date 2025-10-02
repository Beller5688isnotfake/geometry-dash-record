import React from 'react';
import { Video, Monitor, MousePointer } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Video className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Click Recorder</h1>
              <p className="text-xs text-gray-300 hidden sm:block">Screen + Click Recording</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <Monitor size={16} />
                <span>Screen Capture</span>
              </div>
              <div className="flex items-center space-x-1">
                <MousePointer size={16} />
                <span>Click Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;