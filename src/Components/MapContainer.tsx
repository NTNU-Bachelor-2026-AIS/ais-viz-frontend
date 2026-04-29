import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useContext, useEffect, useRef, useState, useMemo, act } from "react";
import style from "../CSS/LibreMap.module.css";
import type { GeoJsonProperties, Point } from "geojson";
import type { FeatureCollection } from "geojson";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { iconLayer, heatMapLayer, BaseStationIconLayer } from "./DeckLayers";
import { Layer } from "@deck.gl/core/typed";
import type Supercluster from "supercluster";
import { CreateCluster, getClusters } from "../utils/SuperClusterUtils";
import {
  LabeledclusteredScatterPlotLayer,
  getMmsiClick,
  getIdClick,
} from "./ClusteredLayers";
import type { shipInfoContextPropS } from "./ShipInfo/ShipInfoContext";
//import cluster from "cluster";
import type { ShipInfoProps } from "./ShipInfo/ShipInfo";
import type { AnyProps, ClusterFeature, PointFeature } from "supercluster";
import { LayerContext } from "../utils/activeVisContext.tsx";
import {
  anomalyGroupScatterPlotLayer,
  individualAnomalyLayer,
} from "./DeckLayers.tsx";
import { getAnomalyGroupByMMSI } from "../api/posts.tsx";

/*
 MapContainer is the file responsible for handling the maplibre instance, creating it and handling its layers based on other files. 
*/

/*
Interface of props mapcontainer needs like responsedata, basestations etc. 
*/
interface MapContainerProps {
  responseData?: FeatureCollection<Point>;
  shipInfoContextValue?: {
    shipInfoProps: ShipInfoProps | undefined;
    setShipInfoProps: React.Dispatch<
      React.SetStateAction<ShipInfoProps | undefined>
    >;
  };
  baseStations: FeatureCollection<Point, GeoJsonProperties>;
}

/*
Function that creates mapcontainer instance, creating maplibre and handling map related tasks.
*/
export const MapContainer = ({
  shipInfoContextValue,
  responseData,
  baseStations,
}: MapContainerProps) => {
  const mapRef = useRef<maplibregl.Map>(null);
  const deckOverlayRef = useRef<MapboxOverlay>(null);
  const [overLayReady, setOverLayReady] = useState<boolean>(false);
  const [bounds, setBounds] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const [zoom, setZoom] = useState<number>(0);
  const context = useContext(LayerContext);
  const [activeLayers, setActiveLayers] = useState<any[]>([]);
  const [selectedMMSI, setSelectedMMSi] = useState<string>("");
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>("");

  // Cluster Index is only created when Responsedata changes
  const clusterIndex = useMemo(() => {
    if (!responseData) return null;
    return CreateCluster(responseData as any);
  }, [responseData]);

  //useeffect creating the maplibre instance on starting website. taken online from maplibre example.
  useEffect(() => {
    if (mapRef.current) return;
    // console.log("rerender of mapitself");
    mapRef.current = new maplibregl.Map({
      container: "map", // container id
      style: "https://tiles.openfreemap.org/styles/bright", // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1, // starting zoom
      renderWorldCopies: false,
    });
  }, []);

  // useeffect creating deckoverlayref that is setting itself to a mapboxoverlay so we can add layers and change props.
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

  //useeffecct to look for change in zoom and bounds after a move.
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

  /*
Useeffect looking at activevis and changing visualization based on its value, used for filtering etc. 
*/
  useEffect(() => {
    if (!mapRef.current || !shipInfoContextValue || !deckOverlayRef.current)
      return;

    if (context?.activeVis === "clustering" && clusterIndex) {
      setSelectedMMSi("");
      setSelectedAnomalyId("");
      let clusters = getClusters(zoom, bounds, clusterIndex) ?? [];
      setActiveLayers([
        BaseStationIconLayer({ baseStations }),
        LabeledclusteredScatterPlotLayer(
          { clusters },
          shipInfoContextValue.setShipInfoProps,
          context.setActiveVis,
        ),
      ]);
    } else if (context?.activeVis === "heatmap" && responseData) {
      setSelectedAnomalyId("");
      setActiveLayers([
        heatMapLayer({ responseData }),
        BaseStationIconLayer({ baseStations }),
      ]);
    } else if (context?.activeVis === "anomalyGroup") {
      setSelectedAnomalyId("");
      setSelectedMMSi(getMmsiClick());
    } else if (context?.activeVis === "individualAnomaly") {
      setSelectedAnomalyId(getIdClick());
    }
  }, [
    bounds,
    zoom,
    context,
    clusterIndex,
    responseData,
    overLayReady,
    context?.activeVis,
  ]);

  /*
Useeffect responsible for creating a layer when use selects mmsi. 
*/
  useEffect(() => {
    //  console.log("selectedmmsi useffect called ");
    if (!deckOverlayRef.current) return;

    let layer: any;
    if (selectedMMSI != "") {
      const getAnomalyGroup = async () => {
        layer = await anomalyGroupScatterPlotLayer(selectedMMSI);

        let nextLayers = [layer, BaseStationIconLayer({ baseStations })];
        //  console.log("next layers " + nextLayers);

        setActiveLayers(nextLayers);
      };
      getAnomalyGroup();
    }
  }, [selectedMMSI]);

  useEffect(() => {
    //  console.log("selectedmmsi useffect called ");
    if (!deckOverlayRef.current) return;

    let layer: any;
    if (selectedAnomalyId != "") {
      const loadLayer = async () => {
        const layer = await individualAnomalyLayer(getIdClick(), zoom);

        setActiveLayers([BaseStationIconLayer({ baseStations }), layer]);
      };

      loadLayer();
    }
  }, [selectedAnomalyId, zoom]);

  /*
useeffect for changing active layer based on activelayers variable. 
*/
  useEffect(() => {
    if (!deckOverlayRef.current) return;
    //   console.log("activelayers useffect called");
    //  console.log(activeLayers + " blablablablablablalb");
    deckOverlayRef.current.setProps({
      layers: activeLayers,
    });
  }, [activeLayers]);

  return <div id="map" className={style.LibreMap}></div>;
};
