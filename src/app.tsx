import { SubwayMap } from "./components/subway-map";
import { Sidebar } from "./components/sidebar";
import { EventLog } from "./components/event-log";
import { Train } from "./components/icons/train";

export function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 isolate relative tracking-wide">
      <div className="flex flex-col items-center w-full grow py-8 relative">
        <div className="absolute top-6 left-6 font-bold text-lg bg-slate-200 p-2 rounded-lg flex gap-1 items-center">
          <Train variant="solid" />
          <h1>Metro Management</h1>
        </div>
        <SubwayMap />
        <Sidebar className="absolute top-6 right-6" />
      </div>
    </div>
  );
}
