import { Video } from "lucide-react";

export default function Timeline() {
  const timeLabels = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  
  const cameras = [
    { id: "camera-01", name: "Camera - 01" },
    { id: "camera-02", name: "Camera - 02" },
    { id: "camera-03", name: "Camera - 03" },
  ];

  const getIncidentMarkers = (cameraId: string) => {
    switch (cameraId) {
      case "camera-01":
        return [
          { type: "Unauthorised Access", position: "left-1/4", color: "bg-orange-badge" },
          { type: "Face Recognised - 14:45", position: "left-1/2", color: "bg-blue-badge" },
          { type: "4 Multiple Events", position: "left-3/4", color: "bg-gray-500" },
          { type: "Unauthorised Access", position: "right-4", color: "bg-orange-badge" },
          { type: "Gun Threat", position: "right-0", color: "bg-red-badge" },
        ];
      case "camera-02":
        return [
          { type: "Unauthorised Access", position: "left-1/4", color: "bg-orange-badge" },
          { type: "Face Recognised", position: "left-2/3", color: "bg-blue-badge" },
        ];
      case "camera-03":
        return [
          { type: "Traffic congestion", position: "left-1/3", color: "bg-teal-badge" },
          { type: "Unauthorised Access", position: "right-4", color: "bg-orange-badge" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-card-bg border-t border-gray-700 p-4">
      {/* Camera List Header */}
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Camera List</h3>
      </div>
      
      {/* Compact 24-hour Timeline */}
      <div className="space-y-2">
        {/* Time ruler */}
        <div className="flex justify-between text-xs text-gray-400 px-2">
          {timeLabels.map((time) => (
            <span key={time}>{time}</span>
          ))}
        </div>
        
        {/* Camera rows with incident markers */}
        <div className="space-y-1">
          {cameras.map((camera) => {
            const markers = getIncidentMarkers(camera.id);
            
            return (
              <div key={camera.id} className="flex items-center space-x-2 h-6">
                <div className="w-16 text-xs text-gray-300 flex items-center">
                  <Video className="w-3 h-3 mr-1" />
                  {camera.name}
                </div>
                <div className="flex-1 relative">
                  <div className="h-4 bg-gray-700 rounded relative">
                    {/* Incident markers positioned across timeline */}
                    {markers.map((marker, index) => (
                      <div 
                        key={index}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${marker.position}`}
                      >
                        <span className={`${marker.color} text-white text-xs px-1 py-0.5 rounded whitespace-nowrap`}>
                          {marker.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
