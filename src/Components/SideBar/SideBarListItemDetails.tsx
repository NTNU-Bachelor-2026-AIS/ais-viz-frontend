import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Point,
} from "geojson";

/*
SidebarListItemDetails is used in sidebar when clicking an anomaly group to show details of that group as this component.
*/

//prop that has the feature that the user clicks on.
interface SideBarListItemDetailsProps {
  feature: Feature<Point, GeoJsonProperties>;
}

//item detail component.
export const SideBarListItemDetails = ({
  feature,
}: SideBarListItemDetailsProps) => {
  return (
    <div className="item-details">
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
