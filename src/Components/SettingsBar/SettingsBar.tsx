import { Settings, Calendar, Filter } from 'lucide-react';
import './SettingsBar.css';



function SettingsBar() {
  return (
    <div className="settings-container">
      {/* Button Section */}
      <div className="button-section">
          <button className="click-button" onClick={() => console.log('Open Settings')}>
            <div className="icon-wrapper">
              <Settings size={20} />
            </div>
            <span>Settings</span>
          </button>

          <button className="click-button" onClick={() => console.log('Open Date')}>
            <div className="icon-wrapper">
              <Calendar size={20} />
            </div>
            <span>Date Range</span>
          </button>

          <button className="click-button" onClick={() => console.log('Open Filter')}>
            <div className="icon-wrapper">
              <Filter size={20} />
            </div>
            <span>Filter</span>
          </button>
      </div>
    </div>
  );
};

export default SettingsBar;