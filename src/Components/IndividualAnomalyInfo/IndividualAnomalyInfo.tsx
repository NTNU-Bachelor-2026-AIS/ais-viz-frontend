import React, { useContext, useState } from "react";
import "../ShipInfo/ShipInfo.css";
import { individualAnomalyContext } from "./InvidiualAnomalyContext.tsx";
import { LayerContext } from "../../utils/activeVisContext.tsx";

// Interface for individual anomaly info.
export interface IndividualAnomalyInfoProps {
  vesselName?: string;
  imoNumber?: string;
  mmsi?: string;
  location?: string;
  signalStrength?: number;
  sourceId?: number;
  destination?: string;
}

/*
Individual anomaly info component that will be a card to show information on a singular ship and location.  based on shipinfo component. 
*/
const IndividualAnomalyInfo = () => {
  const individualAnomaly = useContext(individualAnomalyContext);
  const visContext = useContext(LayerContext);

  //if (individualAnomaly) {
  //   console.log(
  //     " vesselName " +
  //  individualAnomaly?.IndividualAnomalyInfoProps?.vesselName +
  //      " imoNumber " +
  //      individualAnomaly?.IndividualAnomalyInfoProps?.imoNumber +
  //       individualAnomaly?.IndividualAnomalyInfoProps?.mmsi +
  //      " location " +
  //     individualAnomaly?.IndividualAnomalyInfoProps?.location +
  //      " mmsi " +
  //  );
  // }
  if (!individualAnomaly?.individualAnomalyProps) return null; // code taken from https://stackoverflow.com/questions/65750698/check-if-props-are-undefined-when-loading-component

  return (
    <div className="ship-card">
      {/* Top Image Section */}
      <div className="card-image-wrapper">
        <img
          src="../ais-viz-frontend/src/assets/Ship%20Fill.webp"
          alt="Ship"
          className="ship-image"
        />
      </div>
      <button
        className="close-btn"
        onClick={() => {
          visContext?.setActiveVis("individualAnomaly");
          individualAnomaly?.setIndividualAnomalyProps(undefined);
        }}
      >
        X
      </button>

      {/* Scrollable Content Section */}
      <div className="card-content">
        <h2 className="ship-title">
          Mmsi: {individualAnomaly?.individualAnomalyProps?.mmsi}{" "}
        </h2>
        <h3 className="ship-subtitle">
          Ship name:{" "}
          {individualAnomaly?.individualAnomalyProps?.vesselName}{" "}
        </h3>
        <p>
          <strong>Ships location: </strong>{" "}
          {individualAnomaly?.individualAnomalyProps?.location}
        </p>
        <p>
          <strong>
            Signal strength:{" "}
            {individualAnomaly?.individualAnomalyProps?.signalStrength}
          </strong>{" "}
        </p>

        <p>
          <strong>
            Source ID: {individualAnomaly?.individualAnomalyProps?.sourceId}
          </strong>{" "}
        </p>

        <p>
          <strong>
            Destination:{" "}
            {individualAnomaly?.individualAnomalyProps?.destination}
          </strong>{" "}
        </p>
      </div>
    </div>
  );
};

export default IndividualAnomalyInfo;
