import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Point } from "geojson";
import type { FeatureCollection } from "geojson";
import { MapContainer } from "./MapContainer";
import type { ShipInfoProps } from "./ShipInfo/ShipInfo";
import type Supercluster from "supercluster";

//import { Layer } from "react-map-gl/mapbox";
import { useMemo } from 'react';

// Used to allow MapControls to use the values
export type VisType = "clustering" | "heatmap"

/* 
Function component that creates a libremap instance from libremap open source project, is not finished as not going to have style inside
code outside of useffect and useref is from mapLibre.
*/

interface LibreMapProps {
  responseData: FeatureCollection<Point>;
  shipInfoContextValue: {
    shipInfoProps: ShipInfoProps | undefined;
    setShipInfoProps: React.Dispatch<
      React.SetStateAction<ShipInfoProps | undefined>
    >;
  };
  cluster?: Supercluster;
}

export const LibreMap = ({
  responseData,
  shipInfoContextValue,
  cluster,
}: LibreMapProps) => {
  return (
    <>
      <MapContainer
        responseData={responseData}
        shipInfoContextValue={shipInfoContextValue}
      />
    </>
  );
};
