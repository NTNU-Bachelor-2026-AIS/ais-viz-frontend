import { ScatterplotLayer } from "@deck.gl/layers/typed";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Point } from "geojson";
import React from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { IconLayer } from "@deck.gl/layers/typed";
// import type { PickingInfo } from "@deck.gl/core/typed";
import { HeatmapLayer } from "deck.gl/typed";
import { feature, featureCollection } from "@turf/turf";
import type { isAnyArrayBuffer } from "node:util/types";

type boat = {
  ShipName: string;
  mmid: number;
  date: string;
  coordinates: [longitude: number, latitude: number];
};

interface boatData {
  responseData: FeatureCollection<Point>;
}

const jitterx = () => Math.random() * 3;
const jittery = () => Math.random() * 2;

export const iconLayer = ({ responseData }: boatData) => {
  const layer = new IconLayer<boat>({
    id: "IconLayer",
    data: responseData.features,
    getColor: (d: any) => [Math.sqrt(d.exits), 140, 0],
    getIcon: () => "marker",
    getPosition: (d: any) => d.geometry.coordinates,
    getSize: 40,
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json",
    pickable: true,
  });
  return layer;
};

export const heatMapLayer = ({ responseData }: boatData) => {
  const layer = new HeatmapLayer<boat>({
    id: "HeatmapLayer",
    data: responseData.features,
    aggregation: "SUM",
    getPosition: (d: any) => d.geometry.coordinates,
    getWeight: (d: any) => 1,
    radiusPixels: 40,
  });
  return layer;
};

/*
helper function that returns array of coordinates for a feature with jitter, since we will have multiple different layers that have same jitter.
Deprecated after we now have a seed function from backend that creates points that are spaced.  
*/
const returnArrayOfCoords = (d: Feature<Point>) => {
  const coords: [number, number] = [0, 0];

  const x = (d.geometry.coordinates[0] += jitterx());
  const y = (d.geometry.coordinates[1] += jittery());
  coords[0] = x;
  coords[1] = y;

  return coords;
};
