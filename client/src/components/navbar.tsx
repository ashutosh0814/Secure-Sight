import { Camera, Film, Home, Users, AlertTriangle, Video, ChevronDown, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-card-bg border-b border-gray-700 px-6 py-3 h-16">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-btn rounded grid place-items-center">
              <Video className="text-black w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white surveillance-font">MANDLACK</span>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-2 text-yellow-btn">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Camera className="w-4 h-4" />
              <span>Cameras</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Film className="w-4 h-4" />
              <span>Scenes</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
              <span>Incidents</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </a>
          </div>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full grid place-items-center">
            <User className="text-white w-4 h-4" />
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-white">Mohammed Afnas</div>
            <div className="text-xs text-gray-400">afnas@mandlack.com</div>
          </div>
          <ChevronDown className="text-gray-400 w-3 h-3" />
        </div>
      </div>
    </nav>
  );
}
