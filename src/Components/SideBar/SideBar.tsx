import React from 'react';
import './SideBar.css';

const SideBar: React.FC = () => {
  // Dummy data representing database
  const boats = [
    { id: '20502', mmsi: '9344851', name: 'Arctic Ocean' },
    { id: '20503', mmsi: '9123456', name: 'Nordic Star' },
    { id: '20504', mmsi: '9876543', name: 'Baltic Trans' },
    { id: '20505', mmsi: '9445566', name: 'Sea Voyager' },
    { id: '20506', mmsi: '9223344', name: 'Coastal Guard' },
    { id: '20507', mmsi: '9556677', name: 'North Queen' },
    { id: '20508', mmsi: '9667788', name: 'Ocean Link' },
    { id: '20502', mmsi: '9344851', name: 'Arctic Ocean' },
    { id: '20503', mmsi: '9123456', name: 'Nordic Star' },
    { id: '20504', mmsi: '9876543', name: 'Baltic Trans' },
    { id: '20505', mmsi: '9445566', name: 'Sea Voyager' },
    { id: '20506', mmsi: '9223344', name: 'Coastal Guard' },
    { id: '20507', mmsi: '9556677', name: 'North Queen' },
    { id: '20508', mmsi: '9667788', name: 'Ocean Link' },
    { id: '20502', mmsi: '9344851', name: 'Arctic Ocean' },
    { id: '20503', mmsi: '9123456', name: 'Nordic Star' },
    { id: '20504', mmsi: '9876543', name: 'Baltic Trans' },
    { id: '20505', mmsi: '9445566', name: 'Sea Voyager' },
    { id: '20506', mmsi: '9223344', name: 'Coastal Guard' },
    { id: '20507', mmsi: '9556677', name: 'North Queen' },
    { id: '20508', mmsi: '9667788', name: 'Ocean Link' },
  ];
  return(
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
                {boats.map((boat) => (
                <div key={boat.id} className="boat-item">
                    <span className="boat-id">ID : {boat.id},</span>
                    <span className="boat-mmsi"> MMSI = {boat.mmsi}</span>
                </div>
                ))}
            </div>
        </aside>
    );
};

export default SideBar;
