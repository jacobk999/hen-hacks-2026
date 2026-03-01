import { LocationMarker } from "./location";

export function SubwayMap() {
  return (
    <div className="grid grid-cols-10 grid-rows-10 grow aspect-square">
      <div className="row-start-1 col-start-3 col-span-1 bg-red-400 rounded-l-2xl grid">
        <LocationMarker location="North Plaza" />
      </div>
      <div className="row-start-1 col-start-4 row-span-10 bg-red-400 rounded-tr-2xl rounded-bl-2xl" />
      <div className="row-start-10 col-start-5 row-span-2 bg-red-400 rounded-r-2xl grid">
        <LocationMarker location="Riverside Terminal" />
      </div>
      <div className="row-start-3 col-start-1 row-span-3 bg-blue-400 rounded-t-2xl rounded-bl-2xl grid grid-rows-3">
        <LocationMarker location="Wild Hen Stadium" />
      </div>
      <div className="row-start-5 col-start-2 col-span-8 bg-blue-400 rounded-tr-2xl grid grid-cols-8">
        <LocationMarker location="Central Station" className="col-start-3" />
      </div>
      <div className="row-start-6 col-start-9 row-span-3 bg-blue-400 rounded-b-2xl grid grid-rows-3">
        <LocationMarker location="Eastside" className="row-start-3" />
      </div>
      <div className="row-start-8 col-start-1 col-span-6 bg-green-400 rounded-l-2xl grid grid-cols-6">
        <LocationMarker location="West End Junction" />
        <LocationMarker location="Old Town Square" className="col-start-4" />
      </div>
      <div className="row-start-2 col-start-7 row-span-7 bg-green-400 rounded-tl-2xl rounded-br-2xl grid grid-rows-7">
        <LocationMarker location="Leo's Landing" className="row-start-4" />
      </div>
      <div className="row-start-2 col-start-8 col-span-3 bg-green-400 rounded-r-2xl grid grid-cols-3">
        <LocationMarker location="Three Stop" className="col-start-3" />
      </div>
    </div>
  );
}
