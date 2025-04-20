import React from 'react';
import { Link } from 'react-router-dom';
import './Settings.css';
import { useSettings } from '../../context/SettingsContext';

const Settings: React.FC = () => {
  const {
    theme,
    preferredSeating,
    preferredPayment,
    pricePreference,
    setTheme,
    setPreferredSeating,
    setPreferredPayment,
    setPricePreference
  } = useSettings();

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <Link to="/" className="close-button">✕</Link>
      </div>

      <div className="settings-content">
        <div className="setting-section">
          <h2>Preferred Seating</h2>
          <div className="setting-options">
            <button 
              className={`option-button ${preferredSeating === 'indoor' ? 'selected' : ''}`}
              onClick={() => setPreferredSeating('indoor')}
            >
              Indoor
            </button>
            <button 
              className={`option-button ${preferredSeating === 'outdoor' ? 'selected' : ''}`}
              onClick={() => setPreferredSeating('outdoor')}
            >
              Outdoor
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>Preferred Payment</h2>
          <div className="setting-options">
            <button 
              className={`option-button ${preferredPayment === 'cash' ? 'selected' : ''}`}
              onClick={() => setPreferredPayment('cash')}
            >
              Cash
            </button>
            <button 
              className={`option-button ${preferredPayment === 'creditCard' ? 'selected' : ''}`}
              onClick={() => setPreferredPayment('creditCard')}
            >
              Credit Card
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>Price Preference</h2>
          <div className="setting-options">
            <button 
              className={`option-button ${pricePreference === '$' ? 'selected' : ''}`}
              onClick={() => setPricePreference('$')}
            >
              $
            </button>
            <button 
              className={`option-button ${pricePreference === '$$' ? 'selected' : ''}`}
              onClick={() => setPricePreference('$$')}
            >
              $$
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>App Theme</h2>
          <div className="setting-options">
            <button 
              className={`option-button ${theme === 'light' ? 'selected' : ''}`}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button 
              className={`option-button ${theme === 'dark' ? 'selected' : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <Link to="/" className="nav-icon">
          🔍
        </Link>
        <Link to="/match" className="nav-icon">
          😊
        </Link>
        <Link to="/settings" className="nav-icon active">
          ⚙️
        </Link>
      </div>
    </div>
  );
};

export default Settings; 