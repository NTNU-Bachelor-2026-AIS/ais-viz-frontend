import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Point,
} from "geojson";

interface BaseStationInfoProps {
  feature: Feature<Point, GeoJsonProperties>;
}

export const SideBarListItemDetails = ({ feature }: BaseStationInfoProps) => {
  return (
    <div className="baseStation-details">
      <p>
        <strong>ID:</strong> {feature.properties?.id}
      </p>
      <p>
        <strong>Mmsi:</strong> {feature.properties?.mmsi}
      </p>
      <p>
        <strong>Type:</strong> {feature.properties?.type}
      </p>
      <p>
        <strong>coordinates:</strong> {feature.geometry.coordinates.toString()}
      </p>
      <p>
        <strong>started at:</strong> {feature.properties?.startedAt}
      </p>
      <p>
        <strong>last activity at:</strong> {feature.properties?.lastActivityAt}
      </p>
    </div>
  );
};
