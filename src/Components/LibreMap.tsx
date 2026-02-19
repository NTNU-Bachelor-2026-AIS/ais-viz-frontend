import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import style from "../CSS/LibreMap.module.css";
import type { FeatureCollection } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { /**iconLayer,*/ heatMapLayer } from "./DeckLayers";
// import { Layer } from "react-map-gl/mapbox";

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
  let overlayCheck: boolean = false;

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: "map", // container id
      style: "https://tiles.openfreemap.org/styles/bright", // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1, // starting zoom
      renderWorldCopies: false,
    });
    overlayCheck = true;
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
      }
    });
  }, []);

  useEffect(() => {
    if (deckOverlayRef.current) {
      console.log("this should work but doesnt why");
      deckOverlayRef.current.setProps({
        layers: [heatMapLayer({ responseData })],
      });
    }
  }, [responseData, overlayCheck]);

  return <div ref={containerRef} id="map" className={style.LibreMap}></div>;
};
