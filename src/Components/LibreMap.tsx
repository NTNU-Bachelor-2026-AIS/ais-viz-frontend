import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import style from "../CSS/LibreMap.module.css";

/* 
Function component that creates a libremap instance from libremap open source project, is not finished as not going to have style inside
code outside of useffect and useref is from mapLibre.
*/
export const LibreMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    new maplibregl.Map({
      container: "map", // container id
      style: "https://demotiles.maplibre.org/tiles-mlt/plain.json", // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1, // starting zoom
    });
  }, []);
  return <div ref={containerRef} id="map" className={style.LibreMap}></div>;
};
