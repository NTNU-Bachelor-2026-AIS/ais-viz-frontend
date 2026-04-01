import React, { useState } from "react";
import "./SideBar.css";
import type { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import type { Point } from "geojson";
import { SideBarListItemDetails } from "./SideBarListItemDetails";

interface sideBarProps {
  responseData: FeatureCollection<Point>;
}

export const SideBar = ({ responseData }: sideBarProps) => {
  const [query, setquery] = useState("");
  const [anomaly, setAnomaly] = useState<Feature<
    Point,
    GeoJsonProperties
  > | null>(null);

  const handleSearch = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setquery(value);
  };

  const handleItemClick = (e: Feature<Point, GeoJsonProperties> | null) => {
    setAnomaly(e);
  };

  return (
    <aside className="boat-sidebar">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search boat by MMSI"
          className="sidebar-search"
          value={query}
          onChange={handleSearch}
        />
      </div>

      {/* Scrollable Content Section */}
      <div className="list-container">
        {responseData.features.map((feature) => (
          <div
            key={feature.properties?.id}
            className="boat-item"
            onClick={() => handleItemClick(feature)}
          >
            <span className="boat-id">ID : {feature.properties?.id},</span>
            <span className="boat-mmsi"> MMSI: {feature.properties?.mmsi}</span>
            <span className="anomaly-type"> : {feature.properties?.type}</span>
            {anomaly === feature ? (
              <SideBarListItemDetails feature={feature} />
            ) : null}{" "}
            {/*  //
            https://stackoverflow.com/questions/62517789/how-to-render-a-component-on-click-on-list-item-to-show-its-detail
            here is code its based on. */}
          </div>
        ))}
      </div>
    </aside>
  );
};
