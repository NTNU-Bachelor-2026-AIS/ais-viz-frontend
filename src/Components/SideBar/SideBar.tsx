import React from "react";
import "./SideBar.css";
import type { FeatureCollection } from "geojson";
import type { Point } from "geojson";

interface sideBarProps {
  responseData: FeatureCollection<Point>;
}

export const SideBar = ({ responseData }: sideBarProps) => {
  // Dummy data representing database
  return (
    <aside className="boat-sidebar">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search boat by MMSI"
          className="sidebar-search"
        />
      </div>

      {/* Scrollable Content Section */}
      <div className="list-container">
        {responseData.features.map((feature) => (
          <div key={feature.properties?.id} className="boat-item">
            <span className="boat-id">ID : {feature.properties?.id},</span>
            <span className="boat-mmsi"> MMSI: {feature.properties?.mmsi}</span>
            <span className="anomaly-type"> : {feature.properties?.type}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
