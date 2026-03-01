import { SubwayMap } from "./components/subway-map";
import { Sidebar } from "./components/sidebar";
import { Train } from "./components/icons/train";
import { LoseDialog } from "./components/events/lose-screen";
import { GridBackground } from "./components/ui/grid-background";
import { ResetButton } from "./components/ui/reset-button";

export function App() {
  return (
    <div className="h-screen w-screen flex flex-col isolate relative tracking-wide font-sans text-slate-950">
      <GridBackground />
      <div className="flex gap-8 justify-center items-start w-full grow p-8 relative overflow-hidden">
        <div className="flex flex-col gap-2 items-start">
          <div className="font-bold text-lg bg-slate-200 p-2 rounded-lg flex gap-1 items-center">
            <Train variant="solid" />
            <h1>Metro Management</h1>
          </div>
          <ResetButton />
        </div>
        <SubwayMap />
        <Sidebar />
        <LoseDialog />
      </div>
    </div>
  );
}
