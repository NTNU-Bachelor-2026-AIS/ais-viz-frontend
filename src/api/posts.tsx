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


export const getTypeFromString = async (
  anomalyType: string,
): Promise<FeatureCollection<Point> | undefined> => {
  try {
    if (anomalyType.toLocaleLowerCase().includes("speed")) {
      const response = await api.get("/anomaly-groups?type=speed_anomaly");
      console.log("GET Response");
      console.log(response.data);
      return response.data;
    }
    if (
      anomalyType.toLocaleLowerCase().includes("maneuver") ||
      anomalyType.toLocaleLowerCase().includes("unexpected")
    ) {
      const response = await api.get(
        "/anomaly-groups?type=unexpected_maneuver_anomaly",
      );
      console.log("GET Response");
      console.log(response.data);
      return response.data;
    }
    if (anomalyType.toLocaleLowerCase().includes("jumping")) {
      const response = await api.get("/anomaly-groups?type=jumping_anomaly");
      console.log("GET Response");
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.log(error + " an error occured");
    return { type: "FeatureCollection", features: [] };
  }
};
