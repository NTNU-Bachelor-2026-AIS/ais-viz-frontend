import { featureCollection } from "@turf/turf";
import axios from "axios";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import type { Point } from "geojson";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export const getMMSI = async (
  mmsi: string,
): Promise<FeatureCollection<Point> | undefined> => {
  try {
    const response = await api.get("/anomaly-groups?mmsi=" + mmsi);
    console.log("GET Response");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error + " an error occured");
    return { type: "FeatureCollection", features: [] };
  }
};

export const getFilteredAnomalies = async (params: {
  start_date?: string;
  end_date?: string;
  mmsi?: string;
  type?: string;
}): Promise<FeatureCollection<Point> | undefined> => {
  try {
    const response = await api.get("/anomaly-groups", {
      params,
    });
    console.log("GET Response");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error + " an error occured");
    return { type: "FeatureCollection", features: [] };
  }
};
