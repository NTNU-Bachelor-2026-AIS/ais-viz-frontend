import React, { useEffect, useState } from "react";
import "./SideBar.css";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import type { Point } from "geojson";
import { getFilteredAnomalies } from "../../api/posts";

interface getFilteredAnomalies {
  responseData: FeatureCollection<Point>;
}

interface Props {
    onFilterChange: (filters: any) => void;
}

export const TopFilter = ({ onFilterChange }: Props) => {
    const [mmsi, setMmsi] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const applyFilters = () => {
    onFilterChange({
        type,
        start_date: startDate,
        end_date: endDate,
        });
    };
  return (
        <div className="top-filter">
        <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All Types</option>
        </select>

        <input
            type="mmsi"
            value={mmsi}
            onChange={(e) => setMmsi(e.target.value)}
        />

        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
        />

        <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
        />
        </div>
    );
};