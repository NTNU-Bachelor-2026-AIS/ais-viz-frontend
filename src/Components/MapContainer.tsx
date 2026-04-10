import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useContext, useEffect, useMemo, useRef } from "react";
import style from "../CSS/LibreMap.module.css";
import type { Point } from "geojson";
import type { FeatureCollection } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { iconLayer, heatMapLayer } from "./DeckLayers";
import { useState } from "react";
import { Layer } from "@deck.gl/core/typed";
import type Supercluster from "supercluster";
import { CreateCluster, getClusters } from "../utils/SuperClusterUtils";
import { LabeledclusteredScatterPlotLayer } from "./ClusteredLayers";
import type { shipInfoContextPropS } from "./ShipInfo/ShipInfoContext";
import cluster from "cluster";
import type { ShipInfoProps } from "./ShipInfo/ShipInfo";
import type { AnyProps, ClusterFeature, PointFeature } from "supercluster";

interface MapContainerProps {
  responseData?: FeatureCollection<Point>;
  shipInfoContextValue?: {
    shipInfoProps: ShipInfoProps | undefined;
    setShipInfoProps: React.Dispatch<
      React.SetStateAction<ShipInfoProps | undefined>
    >;
  };
}

export const MapContainer = ({
  shipInfoContextValue,
  responseData,
}: MapContainerProps) => {
  const mapRef = useRef<maplibregl.Map>(null);
  const deckOverlayRef = useRef<MapboxOverlay>(null);
  const [overLayReady, setOverLayReady] = useState<boolean>(false);
  const [bounds, setBounds] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const [zoom, setZoom] = useState<number>(0);

  const clusterIndex = useMemo(() => {
    if (!responseData?.features?.length) return null;
    return CreateCluster(responseData as FeatureCollection<Point>);
  }, [responseData]);

  console.log("basemap rerender of mapitself");

  useEffect(() => {
    if (mapRef.current) return;
    console.log("rerender of mapitself");
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
      });
      if (mapRef.current) {
        (mapRef.current.addControl as any)(deckOverlayRef.current);
        setOverLayReady(true);
      }
    });
  }, [overLayReady]);

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

  useEffect(() => {
    if (!mapRef.current || !shipInfoContextValue) return;
    if (cluster && deckOverlayRef.current) {
      let clusters = clusterIndex
        ? getClusters(zoom, bounds, clusterIndex)
        : [];
      deckOverlayRef.current.setProps({
        layers: [
          LabeledclusteredScatterPlotLayer(
            { clusters },
            shipInfoContextValue.setShipInfoProps,
          ),
        ],
      });
    } else {
      if (responseData)
        deckOverlayRef.current?.setProps({
          layers: [],
        });
    }
  }, [bounds, zoom, cluster, responseData, overLayReady]);

  return <div id="map" className={style.LibreMap}></div>;
};
