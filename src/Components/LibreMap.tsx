import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import style from "../CSS/LibreMap.module.css";
import type { Point } from "geojson";
import type { FeatureCollection } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { iconLayer, heatMapLayer } from "./DeckLayers";
import { useState } from "react";
import Supercluster, { type AnyProps, type PointFeature } from "supercluster";
import {
  clusteredIconLayer,
  LabeledclusteredScatterPlotLayer,
} from "./ClusteredLayers";
import { DeprecatedDetails } from "@kystverket/styrbord";
import cluster from "cluster";
//import { Layer } from "react-map-gl/mapbox";

/* 
Function component that creates a libremap instance from libremap open source project, is not finished as not going to have style inside
code outside of useffect and useref is from mapLibre.
*/

interface MapProps {
  responseData: FeatureCollection<Point>;
}

export const LibreMap = ({ responseData }: MapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);
  const deckOverlayRef = useRef<MapboxOverlay>(null);
  const [overLayReady, setOverLayReady] = useState<boolean>(false);
  const [bounds, setBounds] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const [zoom, setZoom] = useState<number>(0);
  const clusterRef = useRef<Supercluster>(null);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: "map", // container id
      style: "https://tiles.openfreemap.org/styles/bright", // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1, // starting zoom
      renderWorldCopies: false,
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on("load", () => {
      deckOverlayRef.current = new MapboxOverlay({
        interleaved: false,
        //layers: [clusteredIconLayer({clusterRef.current.getClusters(bounds, zoom) as any })],
      });
      if (mapRef.current) {
        (mapRef.current.addControl as any)(deckOverlayRef.current);
        setOverLayReady(true);
      }
    });
  }, [overLayReady, responseData]);

  //useeffect for setting up the supercluster.
  useEffect(() => {
    clusterRef.current = new Supercluster({
      log: true,
      radius: 40,
      extent: 256,
      maxZoom: 19,
    }).load(responseData.features as any);
  }, [responseData]);

  //kind of sloppy useeffecct to look for change in zoom and bounds after a move. think about refactoring later
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on("moveend", () => {
      if (!mapRef.current) return;
      setZoom(mapRef.current.getZoom());
      const bounds = mapRef.current.getBounds();
      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      setBounds(bbox);
    });
  }, []);

  //useeffect that logs when zoom and boundary changes, for testing, will then update clustering after or iconlayer ?
  useEffect(() => {
    if (!mapRef.current || !clusterRef.current) return;
    let clusters = clusterRef.current.getClusters(bounds, zoom);
    deckOverlayRef.current?.setProps({
      layers: [LabeledclusteredScatterPlotLayer({ clusters })],
    });
  }, [bounds, zoom]);

  return <div ref={containerRef} id="map" className={style.LibreMap}></div>;
};
