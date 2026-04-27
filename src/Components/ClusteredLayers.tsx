import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Point } from "geojson";
import React, {
  useContext,
  useRef,
  type SetStateAction,
  type Dispatch,
} from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { TextLayer, IconLayer, ScatterplotLayer } from "@deck.gl/layers/typed";
import type {
  PickingInfo,
  CompositeLayer,
  Layer,
  LayersList,
} from "@deck.gl/core/typed";
import { HeatmapLayer } from "deck.gl/typed";
import { feature, featureCollection } from "@turf/turf";
import type { isAnyArrayBuffer } from "node:util/types";
import Supercluster, {
  type ClusterFeature,
  type PointFeature,
  type AnyProps,
} from "supercluster";
import type { GeoJsonProperties } from "geojson";
import type { ShipInfoProps } from "./ShipInfo/ShipInfo";
import { setShipInfoOnClick } from "../utils/MapInteractionUtils";
import { iconLayer } from "./DeckLayers";
import { anomalyGroupScatterPlotLayer } from "./DeckLayers";
import type { VisType } from "../utils/activeVisContext";

/*
File responsible for creating deckGL layers that are clustered based on supercluster.js. 
*/

/*
Represents clustered geojson data. 
*/
interface clusteredBoatData {
  clusters: (
    | ClusterFeature<GeoJsonProperties>
    | PointFeature<GeoJsonProperties>
  )[];
}

/*
local mmsi variable for other files to call get method on. 
*/
let mmsi: string = "";

/*
Clustered Iconlayer creates a iconlayer that works on clustered data. not used in current implementation.
*/
export const clusteredIconLayer = (
  { clusters }: clusteredBoatData,
  setShipInfo?: Dispatch<SetStateAction<ShipInfoProps | undefined>>,
) => {
  const layer = new IconLayer<
    PointFeature<AnyProps> | ClusterFeature<AnyProps>
  >({
    id: "IconLayer",
    data: clusters,
    getColor: (d: any) => [Math.sqrt(d.exits), 140, 0],
    getIcon: (d: any) => "marker",
    getSize: (d: any) =>
      setDataSize(
        d.properties.cluster ? d.properties.point_count : 2,
        calculateMaxClusterSize({ clusters }),
      ),
    getPosition: (d: any) => d.geometry.coordinates,
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json",
    pickable: true,
    onClick: (info, event) => {
      const pickedObject = info.object;
      if (pickedObject.properties.cluster === true) {
        // console.log("Point count:", pickedObject.properties.point_count);
      }
      if (pickedObject.properties.cluster !== true) {
        setShipInfoOnClick(setShipInfo, pickedObject);
      }
    },
  });
  return layer;
};

/*
LabeledClusteredScatterplotlayer is a layer that is a clustered scatterplot layer combined with a labellayer that for each cluster says 
how many anomaly groups are inside it. 
*/
export const LabeledclusteredScatterPlotLayer = (
  { clusters }: clusteredBoatData,
  setShipInfo: Dispatch<SetStateAction<ShipInfoProps | undefined>>,
  setActiveVis: (v: VisType) => void,
) => {
  let scatterLayer = new ScatterplotLayer<
    PointFeature<AnyProps> | ClusterFeature<AnyProps>
  >({
    id: "ScatterplotLayer",
    data: clusters,
    stroked: true,
    radiusUnits: "pixels",
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: (d: any) =>
      setDataSize(
        d.properties.cluster ? d.properties.point_count : 1,
        calculateMaxClusterSize({ clusters }),
      ),
    getFillColor: [0, 0, 0],
    getLineColor: [0, 0, 0],
    getLineWidth: 10,
    radiusScale: 1,
    pickable: true,

    /*
      onClick sets mmsi and active visualization and shipinfo. 
      */
    onClick: async (info, event) => {
      const pickedObject = info.object;
      if (pickedObject.properties.cluster === true) {
        // console.log("Point count:", pickedObject.properties.point_count);
      }

      {
        if (pickedObject.properties.cluster !== true) {
          setMmsiClick(pickedObject.properties.mmsi);
          setShipInfoOnClick(setShipInfo, pickedObject);
          setActiveVis("anomalyGroup");
        }
      }
    },
  });

  /*
  labelLayer that adds a point counter to the scatterlayer. 
 */
  const labelLayer = new TextLayer<
    ClusterFeature<AnyProps> | PointFeature<AnyProps>
  >({
    data: clusters,
    getColor: [255, 128, 0],
    getSize: 16,
    getTextAnchor: "middle",
    getText: (d: any) =>
      d.properties.point_count > 1 ? d.properties.point_count?.toString() : "1",
    getPosition: (d: any) => d.geometry.coordinates,
  });

  return [scatterLayer, labelLayer];
};

/*
  calculates the max cluster size, to be used in the normalization method so that max cluster size is used in computing clusters
  */
function calculateMaxClusterSize({ clusters }: clusteredBoatData) {
  const maxClusterSize = Math.max(
    ...clusters.map((d) =>
      d.properties.cluster ? d.properties.point_count : 1,
    ),
  );
  return maxClusterSize;
}

/*
 sets data point size a desired range of tmin and tmax, and rmin and rmax are the actual ranges of our data set. 
*/
function setDataSize(size: number, maxSize: number) {
  const rmin = Math.sqrt(3);
  const rmax = Math.sqrt(maxSize);
  const tmin = 15;
  const tmax = 30;

  const normalized = (Math.sqrt(size) - rmin) / (rmax - rmin);
  if (size == 3) return 20;
  if (size == 2) return 15;
  if (size == 1) return 9;

  return normalized * (tmax - tmin) + tmin;
}

/*
method that sets mmsi to the currently clicked anomaly group. 
*/
const setMmsiClick = (newMMSI: string) => {
  mmsi = newMMSI;
};

/*
returns the mmsi of the currently clicked anomaly group, for use in MapContainer to change layer when an anomaly group of 1 is clicked on. 
*/
export const getMmsiClick = (): string => {
  return mmsi;
};
