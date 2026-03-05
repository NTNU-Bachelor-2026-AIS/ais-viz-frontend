import { ScatterplotLayer } from "@deck.gl/layers/typed";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Point } from "geojson";
import React, { useRef } from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { IconLayer } from "@deck.gl/layers/typed";
import type { PickingInfo } from "@deck.gl/core/typed";
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
      getIconSize(d.properties.cluster ? d.properties.point_count : 2),
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

/*
taken from deckgl example github. 
*/
function getIconName(size: number): string {
  return "marker";
}

/*
 sets icon size to either if its 1 point 10 so its lower than a cluster 
 or sets it via square root to give a good visualization of the biggest clusters. 
*/
function getIconSize(size: number) {
  if (size <= 1) return 10;
  return Math.sqrt(size) + 15;
}
