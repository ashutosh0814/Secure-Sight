import { Play, SkipBack, SkipForward, RotateCcw, Maximize, Volume2 } from "lucide-react";

export default function IncidentPlayer() {
  return (
    <div className="flex-1 p-6 space-y-4">
      {/* Timestamp */}
      <div className="bg-card-bg px-3 py-1 rounded text-xs text-gray-300 inline-block timestamp">
        11/7/2025 - 03:12:37
      </div>
      
      {/* Main Video Player */}
      <div className="relative">
        {/* Main video showing vault scene with person in white shirt and jewelry displays */}
        <img 
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450" 
          alt="Vault surveillance showing person in white shirt accessing jewelry displays" 
          className="w-full h-96 object-cover rounded-lg bg-gray-800" 
        />
        
        {/* Camera indicator */}
        <div className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full pulse-red"></div>
          <span className="camera-label">Camera - 01</span>
        </div>
      </div>
      
      {/* Camera Thumbnail Strip */}
      <div className="flex space-x-4">
        {/* Camera 02 */}
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1 camera-label">Camera - 02</div>
          {/* Shop floor camera showing retail environment */}
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225" 
            alt="Shop floor camera showing retail environment with shelves and products" 
            className="w-full h-24 object-cover rounded bg-gray-800" 
          />
        </div>
        
        {/* Camera 03 */}
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1 camera-label">Camera - 03</div>
          {/* Entrance camera showing doorway security view */}
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225" 
            alt="Entrance camera showing doorway and security checkpoint area" 
            className="w-full h-24 object-cover rounded bg-gray-800" 
          />
        </div>
      </div>
      
      {/* Video Controls */}
      <div className="bg-card-bg rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-yellow-btn transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button className="text-white hover:text-yellow-btn transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Play className="w-4 h-4 ml-0.5" />
          </button>
          <button className="text-white hover:text-yellow-btn transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
          <button className="text-white hover:text-yellow-btn transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
          
          {/* Timeline */}
          <div className="flex-1 mx-4">
            <div className="bg-gray-600 h-1 rounded-full relative">
              <div className="bg-yellow-btn h-1 rounded-full w-1/3"></div>
              <div className="bg-yellow-btn w-3 h-3 rounded-full absolute top-1/2 transform -translate-y-1/2 left-1/3"></div>
            </div>
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-gray-300">03:12:37/15-Jun-2025</span>
          
          <button className="text-white hover:text-yellow-btn transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
