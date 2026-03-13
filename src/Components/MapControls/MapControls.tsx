import type { VisType } from "../LibreMap.tsx"

interface MapControlsProps {
  activeLayer: VisType;
  setActiveLayer: (type: VisType) => void;
}

export const MapControls = ({ activeLayer, setActiveLayer }: MapControlsProps) => {
  return (
    <div className="mapcontrols-container">
        <div className="select-section">
        <label>Visualization</label>
        <select 
          value={activeLayer} 
          onChange={(e) => setActiveLayer(e.target.value as VisType)}
        >
          <option value="clustering">Clustering</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </div>
    </div>
      );
    };