import { featureCollection } from "@turf/turf";
import axios from "axios";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import type { Point } from "geojson";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

/*
function that returns an anomaly group based on mmsi. 
*/
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

/*
method that returns featurecollection of anomaly points related to an anomaly group id. 
*/
export const getAnomalyPointsById = async (
  id: string,
): Promise<FeatureCollection<Point> | undefined> => {
  try {
    const response = await api.get("anomaly-groups/" + id);
    console.log("GET Response");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error + " an error occured");
    return { type: "FeatureCollection", features: [] };
  }
};


/*
Method that makes api call to get a featurecollection of anomalies of specific type from input string. 
*/
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

/*
Method that gets all basestation and returns a promise of the featurecollection of basestations. 
default and empty featurecollection is returned.
*/
export const getBaseStations = async (): Promise<FeatureCollection<Point>> => {
  try {
    const response = await api.get("/base-stations");
    console.log("GET Response");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error + " an error occured");
    return { type: "FeatureCollection", features: [] };
  }
};


export const getAnomalyGroupIndividualPoints = async (
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
