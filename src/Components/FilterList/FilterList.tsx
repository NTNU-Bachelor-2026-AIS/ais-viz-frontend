import React, { useEffect, useState } from "react";
import "./FilterList.css";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import type { Point } from "geojson";
import { getFilteredAnomalies } from "../../api/posts";


interface Props {
    onFilterSubmit: (filters: { mmsi: string, type: string, startDate: string, endDate:string }) => void;
}

export const FilterList = ({ onFilterSubmit }: Props) => {
    const [mmsi, setMmsi] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    const applyFilters = () => {
    onFilterSubmit({
        type: type,
        mmsi: mmsi,
        startDate: startDate,
        endDate: endDate,
        });
    };

  return (
        <div className="top-filter">
            <select
                value={type} 
                onChange={(e) => setType(e.target.value)}
                >
            <option value="">All Types</option>
            <option value="unexpected_maneuver_anomaly">Unexpected Maneuver Anomaly</option>
            <option value="speed_anomaly">Speed Anomaly</option>
            <option value="jumping_anomaly">Jumping Anomaly</option>
            </select>

            <input
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

            <button onClick={applyFilters}>
                <p>Submit</p>
            </button>
        </div>
    );
};