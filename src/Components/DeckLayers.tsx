import { LineLayer, ScatterplotLayer } from "@deck.gl/layers/typed";
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
import { getAnomalyGroupByMMSI, getAnomalyPointsById } from "../api/posts";
import { type AnyProps } from "supercluster";
import { mapBaseStationToCoords } from "../utils/MapInteractionUtils";
import { signalStrengthGradient } from "../utils/ColorGradientUtils";

/*
File responsible for creating DeckGlLayers that are not clustered. 
*/

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
  const layer = new IconLayer<any>({
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
  const layer = new IconLayer<any>({
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

/*
Function that returns a layer that is made up of a scatterplot of an anomaly group and linelayers of signalstrength of the individual
points inside of the anomaly group tied to their basestation 
basestation coordinates are hardcoded in MapInteractionUtiLS. 
*/
export const anomalyGroupScatterPlotLayer = async (mmsi: string) => {
  const anomalyData = await getAnomalyGroupByMMSI(mmsi);
  console.log("anomalydata features " + anomalyData?.features);
  const features = anomalyData?.features;

  const anomalyGroupLayer = new ScatterplotLayer<any>({
    id: "scatterPlotLayer",
    data: anomalyData?.features,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: 600,
    getFillColor: [0, 0, 0],
    getLineColor: [0, 0, 0],
    getLineWidth: 10,
    radiusScale: 60,
    pickable: true,
  });

  const anomalyID = features?.[0]?.properties?.id;

  const individualAnomalyData = await getAnomalyPointsById(anomalyID);

  const coords = await mapBaseStationToCoords();

  const lineLayer = new LineLayer<any>({
    id: "LineLayer",
    data: individualAnomalyData?.features,
    getColor: (d: any) =>
      signalStrengthGradient(d.properties.signalStrength).rgb(),
    getSourcePosition: (d) => d.geometry.coordinates,
    getTargetPosition: (d: any) =>
      coords.get(d.properties.sourceId) ?? ([0, 0] as [number, number]),
    getWidth: 4,
    widthScale: 2,
    widthMinPixels: 1,
    widthMaxPixels: 10,
    opacity: 0.5,
    rounded: true,
    pickable: true,
  });

  return [anomalyGroupLayer, lineLayer];
};

export const individualAnomalyLayer = async (id: string, zoom: number) => {
  const anomalyData = await getAnomalyPointsById(id);
  console.log("anomalydata features " + anomalyData?.features);
  const features = anomalyData?.features;
  const anomalyGroupLayer = new ScatterplotLayer<any>({
    id: "scatterPlotLayer",
    data: anomalyData?.features,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: getRadiusByZoom(zoom),
    getFillColor: (d: any) =>
      signalStrengthGradient(d.properties.signalStrength).rgb(),
    getLineColor: [0, 0, 0],
    getLineWidth: 10,
    radiusScale: 60,
    pickable: true,
  });

  return anomalyGroupLayer;
};

/*
function that creates a deckgl heat map layer based on featurecollection data sent in parameter.   
*/
export const heatMapLayer = ({ responseData }: anomalyGroupData) => {
  const layer = new HeatmapLayer<any>({
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
  if (!d?.geometry?.coordinates) return [0, 0];
  const coords: [number, number] = [0, 0];

  const x = (d.geometry.coordinates[0] += jitterx());
  const y = (d.geometry.coordinates[1] += jittery());
  coords[0] = x;
  coords[1] = y;

  return coords;
};

/*
Hardcoded radius level by zoom. zoom will be sent down by mapcontainer. 
*/
const getRadiusByZoom = (zoom: number) => {
  if (zoom <= 2) return 40000;
  if (zoom <= 4) return 500;
  if (zoom <= 6) return 150;
  if (zoom <= 8) return 80;
  if (zoom <= 10) return 40;
  return 1;
};
