import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Camera {
  id: string;
  name: string;
  location: string;
}

interface Incident {
  id: string;
  cameraId: string;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera: Camera;
}

export default function IncidentList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: incidents = [], isLoading } = useQuery<Incident[]>({
    queryKey: ["/api/incidents?resolved=false"],
  });

  const { data: resolvedIncidents = [] } = useQuery<Incident[]>({
    queryKey: ["/api/incidents?resolved=true"],
  });

  const resolveIncidentMutation = useMutation({
    mutationFn: async (incidentId: string) => {
      const response = await apiRequest("PATCH", `/api/incidents/${incidentId}/resolve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({
        title: "Incident Resolved",
        description: "The incident has been successfully resolved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resolve incident. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleResolveIncident = (incidentId: string) => {
    resolveIncidentMutation.mutate(incidentId);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Unauthorised Access":
        return "bg-orange-badge";
      case "Gun Threat":
        return "bg-red-badge";
      case "Face Recognised":
        return "bg-blue-badge";
      case "Traffic congestion":
        return "bg-teal-badge";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (tsStart: string, tsEnd: string) => {
    const start = new Date(tsStart);
    const end = new Date(tsEnd);
    const startTime = format(start, "HH:mm");
    const endTime = format(end, "HH:mm");
    const date = format(start, "d-MMM-yyyy");
    return `${startTime} - ${endTime} on ${date}`;
  };

  if (isLoading) {
    return (
      <div className="w-96 bg-card-bg p-6 border-l border-gray-700 overflow-y-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-6"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-dark-bg rounded-lg p-4 border border-gray-600 mb-4">
              <div className="flex space-x-3">
                <div className="w-12 h-9 bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
                <div className="w-16 h-6 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-card-bg p-6 border-l border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <h2 className="text-lg font-semibold">{incidents.length} Unresolved Incidents</h2>
        </div>
        <div className="text-xs text-gray-400">{resolvedIncidents.length} resolved incidents</div>
      </div>
      
      {/* Incident Cards */}
      <div className="space-y-4">
        {incidents.map((incident) => (
          <div 
            key={incident.id} 
            className="bg-dark-bg rounded-lg p-4 border border-gray-600 transition-opacity duration-300"
            style={{
              opacity: resolveIncidentMutation.isPending ? 0.5 : 1
            }}
          >
            <div className="flex space-x-3">
              {/* Incident thumbnail */}
              <img 
                src={incident.thumbnailUrl} 
                alt={`${incident.type} incident footage`} 
                className="w-12 h-9 object-cover rounded" 
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`${getBadgeColor(incident.type)} text-white text-xs px-2 py-1 rounded incident-type`}>
                    {incident.type}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-1">
                  {incident.camera.location}
                </div>
                <div className="text-xs text-gray-400 timestamp">
                  {formatTime(incident.tsStart, incident.tsEnd)}
                </div>
              </div>
              <button 
                className="bg-yellow-btn text-black px-3 py-1 rounded text-xs font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50"
                onClick={() => handleResolveIncident(incident.id)}
                disabled={resolveIncidentMutation.isPending}
              >
                Resolve
              </button>
            </div>
          </div>
        ))}

        {incidents.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>No unresolved incidents</p>
          </div>
        )}
      </div>
    </div>
  );
}
