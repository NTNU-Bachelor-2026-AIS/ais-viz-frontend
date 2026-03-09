import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Point } from "geojson";
import React, { useRef } from "react";
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
  type AnyProps,
  type ClusterFeature,
  type PointFeature,
} from "supercluster";

type boat = {
  ShipName: string;
  mmid: number;
  date: string;
  coordinates: [longitude: number, latitude: number];
};

interface clusteredBoatData {
  clusters: (ClusterFeature<AnyProps> | PointFeature<AnyProps>)[];
}

export const clusteredIconLayer = ({ clusters }: clusteredBoatData) => {
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
        console.log("Point count:", pickedObject.properties.point_count);
      }
      console.log("ID:", pickedObject.id);
      console.log("Name:", pickedObject.name);
      console.log(pickedObject.properties);
    },
  });
  //console.log("DATA:", clusters);
  return layer;
};

export const LabeledclusteredScatterPlotLayer = ({
  clusters,
}: clusteredBoatData) => {
  const scatterLayer = new ScatterplotLayer<
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

    onClick: (info, event) => {
      const pickedObject = info.object;
      if (pickedObject.properties.cluster === true) {
        console.log("Point count:", pickedObject.properties.point_count);
      }
      console.log("ID:", pickedObject.id);
      console.log("Name:", pickedObject.name);
      console.log(pickedObject.properties);
    },
  });

  const labelLayer = new TextLayer<
    ClusterFeature<AnyProps> | PointFeature<AnyProps>
  >({
    data: clusters,
    getColor: [255, 128, 0],
    getSize: 16,
    getTextAnchor: "middle",
    getText: (d: any) => d.properties.point_count?.toString(),
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

  return normalized * (tmax - tmin) + tmin;
}
