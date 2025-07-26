import Navbar from "@/components/navbar";
import IncidentPlayer from "@/components/incident-player";
import IncidentList from "@/components/incident-list";
import Timeline from "@/components/timeline";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        <IncidentPlayer />
        <IncidentList />
      </div>
      <Timeline />
    </div>
  );
}
