import React from 'react';
import './ShipInfo.css';

// Interface for future props
interface ShipInfoProps {
  name?: string;
  mmsi?: string;
  description?: string;
}

const ShipInfo: React.FC<ShipInfoProps> = () => {
  return (
    <div className="ship-card">
      {/* Top Image Section */}
      <div className="card-image-wrapper">
        <img 
          src="..\src\assets\Ship Fill.webp" 
          alt="Ship" 
          className="ship-image" 
        />
      </div>

      {/* Scrollable Content Section */}
      <div className="card-content">
        <h2 className="ship-title">Ship ship</h2>
        <h3 className="ship-subtitle">Lorem ipsum</h3>
        
        <p className="ship-description">
          This ship sent AIS message at coordinate (50, 204).
        </p>

        <div className="ship-details">
          <p><strong>Info about ship:</strong> lorem ipsum</p>
          <p><strong>Speed etc:</strong> 15 knots</p>
          <p><strong>Status:</strong> Active</p>
          <p>Additional database info in the future...</p>
        </div>

        <button className="edit-button">Edit Info (Admin only)</button>
      </div>
    </div>
  );
};

export default ShipInfo;