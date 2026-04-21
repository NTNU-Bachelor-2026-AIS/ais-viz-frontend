import { ScatterplotLayer } from "@deck.gl/layers/typed";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import type { Point } from "geojson";
import React from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { IconLayer } from "@deck.gl/layers/typed";
// import type { PickingInfo } from "@deck.gl/core/typed";
import { HeatmapLayer } from "deck.gl/typed";
import { feature, featureCollection } from "@turf/turf";
import type { isAnyArrayBuffer } from "node:util/types";
import { getMMSI } from "../api/posts";
import { type AnyProps } from "supercluster";

/*
Defines a type of boat with a shipname, mmid, date and coordinates.  
*/
type anomalyGroup = {
  mmsid: number;
  date: string;
  coordinates: [longitude: number, latitude: number];
};

/*
interface creating a type of featurecollection called responsedata which will be used for creating layers 
*/
interface anomalyGroupData {
  responseData: FeatureCollection<Point>;
}

/*
interface creating a type of featurecollection called basestations, just use to differentiate from the other featurecollection
used specificalyl for creating the base station layer. 
*/
interface baseStationData {
  baseStations: FeatureCollection<Point>;
}

const jitterx = () => Math.random() * 3;
const jittery = () => Math.random() * 2;

/*
Function that creates an iconlayer based on a featurecollection in parameter  
*/
export const iconLayer = ({ responseData }: anomalyGroupData) => {
  const layer = new IconLayer<anomalyGroup>({
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

/*
function that creates a deckgl iconlayer specifically for the base stations of the project, with their own svg. 
gets a featurecollection in parameter that it will create the layer out of 
*/
export const BaseStationIconLayer = ({ baseStations }: baseStationData) => {
  const layer = new IconLayer<anomalyGroup>({
    id: "IconLayer",
    data: baseStations.features,
    getColor: (d: any) => [0, 0, 255],
    getIcon: () => ({
      url: "/ais-viz-frontend/public/icons/BaseStation.svg",
      width: 30,
      height: 30,
      mask: true,
    }),
    getPosition: (d: any) => d.geometry.coordinates,
    getSize: 40,

    pickable: true,
  });
  return layer;
};

export const anomalyGroupScatterPlotLayer = async (searchString: string) => {
  const anomalyData = await getMMSI(searchString);
  const scatterPlotLayer = new ScatterplotLayer<anomalyGroup>({
    id: "scatterPlotLayer",
    data: anomalyData?.features,
    getPosition: (d: any) => d.geometry.coordinates,
  });
  return scatterPlotLayer;
};

/*
function that creates a deckgl heat map layer based on featurecollection data sent in parameter.   
*/
export const heatMapLayer = ({ responseData }: anomalyGroupData) => {
  const layer = new HeatmapLayer<anomalyGroup>({
    id: "HeatmapLayer",
    data: responseData.features,
    aggregation: "SUM",
    getPosition: (d: any) => d.geometry.coordinates,
    getWeight: (d: any) => 1,
    radiusPixels: 40,
  });
  console.log(responseData.features);
  return layer;
};

/*
helper function that returns array of coordinates for a feature with jitter, since we will have multiple different layers that have same jitter.
Deprecated after we now have a seed function from backend that creates points that are spaced.  
*/
const returnArrayOfCoords = (d: Feature<Point>) => {
  if (!d?.geometry?.coordinates) return [0, 0];
  const coords: [number, number] = [0, 0];

  const x = (d.geometry.coordinates[0] += jitterx());
  const y = (d.geometry.coordinates[1] += jittery());
  coords[0] = x;
  coords[1] = y;

  return coords;
};
