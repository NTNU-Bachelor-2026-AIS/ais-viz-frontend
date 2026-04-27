import { useContext } from "react";
import { LayerContext } from "../../utils/activeVisContext.tsx";
import type { VisType } from "../LibreMap.tsx";

/*
Macontrols is a component responsible for changing visualization type, used as filtering component. 
*/
export const MapControls = () => {
  const context = useContext(LayerContext);
  return (
    <div className="mapcontrols-container">
      <div className="select-section">
        <label>Visualization</label>
        <select
          onChange={(e) => context?.setActiveVis(e.target.value as VisType)}
        >
          <option value="clustering">Clustering</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </div>
    </div>
  );
};
