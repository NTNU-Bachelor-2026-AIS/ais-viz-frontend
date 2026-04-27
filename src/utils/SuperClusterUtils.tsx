import cluster from "cluster";
import type { FeatureCollection, Point } from "geojson";
import Supercluster from "supercluster";

//creates a cluster from a featurecollection of point(response data).
export const CreateCluster = (data: FeatureCollection<Point>) => {
  if (!data?.features?.length) return null;
  return new Supercluster({
    log: true,
    radius: 40,
    extent: 256,
    maxZoom: 19,
  }).load(data.features as any);
};

//gets cluster at a zoom level and bbox area.
export const getClusters = (
  zoom: number,
  bbox: [number, number, number, number],
  clusterIndex: Supercluster,
) => {
  if (!clusterIndex) return;
  return clusterIndex.getClusters(bbox, zoom);
};
