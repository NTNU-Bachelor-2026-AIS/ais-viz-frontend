import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import style from "../CSS/LibreMap.module.css";
import type { FeatureCollection } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { iconLayer, heatMapLayer } from "./DeckLayers";
import { useState } from "react";
//import { Layer } from "react-map-gl/mapbox";

/* 
Function component that creates a libremap instance from libremap open source project, is not finished as not going to have style inside
code outside of useffect and useref is from mapLibre.
*/

interface MapProps {
  responseData: FeatureCollection;
}

export const LibreMap = ({ responseData }: MapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);
  const deckOverlayRef = useRef<MapboxOverlay>(null);
  const [overLayReady, setOverLayReady] = useState<boolean>(false);

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
        layers: [heatMapLayer({ responseData })],
      });
      if (mapRef.current) {
        (mapRef.current.addControl as any)(deckOverlayRef.current);
        setOverLayReady(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!deckOverlayRef.current) return;
    deckOverlayRef.current.setProps({
      layers: [iconLayer({ responseData })],
    });
  }, [responseData, overLayReady]);

  return <div ref={containerRef} id="map" className={style.LibreMap}></div>;
};
