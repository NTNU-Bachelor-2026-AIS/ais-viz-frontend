import { useContext } from "react";
import { LayerContext } from "../../utils/activeVisContext";
import "./BackToAnomalyClusterButton.css";

// Interface for shipinfo.

/*
ShipInfo component that will be a card to show information on ship and location when pressing its anomaly group. 
*/
export const BackToAnomalyClusterButton = () => {
  const visContext = useContext(LayerContext);

  if (visContext?.activeVis !== "individualAnomaly") return null;
  return (
    <button
      className="back-button"
      onClick={() => {
        visContext?.setActiveVis("clustering");
      }}
    >
      Go back to clustered view
    </button>
  );
};
