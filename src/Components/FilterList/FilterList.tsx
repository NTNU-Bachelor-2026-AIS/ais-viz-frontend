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
import { toBackendDateTime } from "../../utils/timeUtils"



/**
 * FilterList Is a UI component that allows filtering based on mmsi, type, start date and end date 
 * it calls the apply filter method on button click. 
 * */

interface Props {
    onFilterSubmit: (filters: { mmsi: string, type: string,  start_date: string, end_date:string }) => void;
}

export const FilterList = ({ onFilterSubmit }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const [mmsi, setMmsi] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    const applyFilters = () => {
    onFilterSubmit({
        type: type,
        mmsi: mmsi,
        start_date:  toBackendDateTime(startDate),
        end_date:  toBackendDateTime(endDate),
        });
        setIsOpen(false);
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
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />

            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            <button onClick={applyFilters}>
                <p>Submit</p>
            </button>
        </div>
    );
};