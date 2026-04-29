import React, { useContext, useState } from "react";
import "./ShipInfo.css";
import { shipInfoContext } from "./ShipInfoContext.tsx";
import { LayerContext } from "../../utils/activeVisContext.tsx";

// Interface for shipinfo.
export interface ShipInfoProps {
  id?: string;
  lastActivityAt?: string;
  mmsi?: string;
  startedAt?: string;
  anomalyType?: string;
  location?: string;
}

/*
ShipInfo component that will be a card to show information on ship and location when pressing its anomaly group. 
*/
const ShipInfo = () => {
  const shipInfo = useContext(shipInfoContext);
  const visContext = useContext(LayerContext);

  if (shipInfo) {
    console.log(
      " type " +
        shipInfo?.shipInfoProps?.anomalyType +
        " id " +
        shipInfo?.shipInfoProps?.id +
        "  lastactivity " +
        shipInfo?.shipInfoProps?.lastActivityAt +
        " location " +
        shipInfo?.shipInfoProps?.location +
        " mmsi " +
        shipInfo?.shipInfoProps?.mmsi +
        " startedat " +
        shipInfo?.shipInfoProps?.startedAt,
    );
  }
  if (!shipInfo?.shipInfoProps)
    return null; // code taken from https://stackoverflow.com/questions/65750698/check-if-props-are-undefined-when-loading-component
  else
    return shipInfo ? (
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
            visContext?.setActiveVis("clustering");
            shipInfo.setShipInfoProps(undefined);
          }}
        >
          X
        </button>

        {/* Scrollable Content Section */}
        <div className="card-content">
          <h2 className="ship-title">
            Id: {shipInfo?.shipInfoProps?.id} Mmsi:{" "}
            {shipInfo?.shipInfoProps?.mmsi}{" "}
          </h2>
          <h3 className="ship-subtitle">Lorem shipsum</h3>

          <p className="ship-description">
            This ship sent AIS message at coordinate{" "}
            {shipInfo?.shipInfoProps?.location}.
          </p>

          <div className="ship-details">
            <p>
              <strong>Anomaly type :</strong>{" "}
              {shipInfo?.shipInfoProps?.anomalyType}
            </p>
            <p>
              <strong>Anomaly started at : </strong>{" "}
              {shipInfo?.shipInfoProps?.startedAt}
            </p>
            <p>
              <strong>Ships last activity at: </strong>{" "}
              {shipInfo?.shipInfoProps?.lastActivityAt}
            </p>
            <p>New features later ?. </p>
          </div>

          <button
            className="show-button"
            onClick={() => {
              visContext?.setActiveVis("individualAnomaly");
              shipInfo.setShipInfoProps(undefined);
            }}
          >
            Show Anomalies
          </button>
        </div>
      </div>
    ) : null;
};

export default ShipInfo;
