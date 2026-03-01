import { SubwayMap } from "./components/subway-map";
import { Sidebar } from "./components/sidebar";
import { Train } from "./components/icons/train";
import { GridBackground } from "./components/ui/grid-background";

export function App() {
  return (
    <div className="h-screen w-screen flex flex-col isolate relative tracking-wide">
      <GridBackground />
      <div className="flex flex-col items-center w-full grow py-8 relative">
        <div className="absolute top-8 left-8 font-bold text-lg bg-slate-200 p-2 rounded-lg flex gap-1 items-center">
          <Train variant="solid" />
          <h1>Metro Management</h1>
        </div>
        <SubwayMap />
        <Sidebar className="absolute top-8 right-8" />
      </div>
    </div>
  );
}
