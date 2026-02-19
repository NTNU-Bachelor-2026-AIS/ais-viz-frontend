// import { ScatterplotLayer } from "@deck.gl/layers/typed";
import type { FeatureCollection } from "geojson";
// import type { Point } from "geojson";
// import React from "react";
// import { DeckGL } from "@deck.gl/react/typed";
import { IconLayer } from "@deck.gl/layers/typed";
// import type { PickingInfo } from "@deck.gl/core/typed";
import { HeatmapLayer } from "deck.gl/typed";

type boat = {
  ShipName: string;
  mmid: number;
  date: string;
  coordinates: [longitude: number, latitude: number];
};

interface boatData {
  responseData: FeatureCollection;
}

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
    getWeight: () => 1,
    radiusPixels: 25,
  });
  return layer;
};
