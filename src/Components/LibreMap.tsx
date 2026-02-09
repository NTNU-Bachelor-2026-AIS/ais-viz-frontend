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
    const map = new maplibregl.Map({
      container: "map", // container id
      style: "https://tiles.openfreemap.org/styles/bright", // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1, // starting zoom
      renderWorldCopies: false,
    });

    map.on("load", () => {
      map.setLayoutProperty("label_country", "text-field", [
        "format",
        ["get", "name_en"],
        { "font-scale": 1.2 },
        "\n",
        {},
        ["get", "name"],
        {
          "font-scale": 0.8,
          "text-font": ["literal", ["Comic Sans MS"]],
        },
      ]);
      map.setLayerZoomRange("label_state", 1, 24);
      map.setLayerZoomRange("label_city", 1, 24);
      map.setLayerZoomRange("label_town", 1, 24);
      map.setLayerZoomRange("label_village", 1, 24);
      map.setLayerZoomRange("label_other", 1, 24);

      map.addSource("vertical_line", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [0, -10000], // south end
              [0, 10000],
            ],
          },
        },
      });
      map.addLayer({
        id: "vertical_line",
        type: "line",
        source: "vertical_line",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#333232",
          "line-width": 1,
        },
      });

      map.addSource("horizontal_line", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [1000, 0], // south end
              [-1000, 0],
            ],
          },
        },
      });
      map.addLayer({
        id: "horizontal_line",
        type: "line",
        source: "horizontal_line",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#333232",
          "line-width": 1,
        },
      });
    });
  }, []);

  return <div ref={containerRef} id="map" className={style.LibreMap}></div>;
};
