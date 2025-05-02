import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Settings.css";
import { useSettings } from "../../context/SettingsContext";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';

const Settings: React.FC = () => {
  const {
    theme,
    preferredSeating,
    preferredPayment,
    pricePreference,
    preferredNoise,
    wheelchairAccessible,
    userBlurb,
    setTheme,
    setPreferredSeating,
    setPreferredPayment,
    setPricePreference,
    setPreferredNoise,
    setWheelchairAccessible,
    setUserBlurb,
  } = useSettings();
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <Link to="/" className="close-button">
          ✕
        </Link>
      </div>


      <div className="settings-content">
        <div className="setting-section">
          <h2>About You!</h2>
          <textarea
            className="user-blurb-input"
            placeholder="Tell us anything you'd like!"
            value={userBlurb}
            onChange={(e) => setUserBlurb(e.target.value)}
            rows={4}
          />
        </div>
        <div className="setting-section">
          <h2>Preferred Seating</h2>
          <div className="setting-options">
            <button
              className={`option-button ${
                preferredSeating === "indoor" ? "selected" : ""
              }`}
              onClick={() => setPreferredSeating("indoor")}
            >
              Indoor
            </button>
            <button
              className={`option-button ${
                preferredSeating === "outdoor" ? "selected" : ""
              }`}
              onClick={() => setPreferredSeating("outdoor")}
            >
              Outdoor
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>Preferred Payment</h2>
          <div className="setting-options">
            <button
              className={`option-button ${
                preferredPayment === "cash" ? "selected" : ""
              }`}
              onClick={() => setPreferredPayment("cash")}
            >
              Cash
            </button>
            <button
              className={`option-button ${
                preferredPayment === "creditCard" ? "selected" : ""
              }`}
              onClick={() => setPreferredPayment("creditCard")}
            >
              Credit Card
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>Price Preference</h2>
          <div className="setting-options">
            <button
              className={`option-button ${
                pricePreference === "$" ? "selected" : ""
              }`}
              onClick={() => setPricePreference("$")}
            >
              $
            </button>
            <button
              className={`option-button ${
                pricePreference === "$$" ? "selected" : ""
              }`}
              onClick={() => setPricePreference("$$")}
            >
              $$
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>Noise Preference</h2>
          <div className="setting-options">
            <button
              className={`option-button ${
                preferredNoise === "quiet" ? "selected" : ""
              }`}
              onClick={() => setPreferredNoise("quiet")}
            >
              Quiet
            </button>
            <button
              className={`option-button ${
                preferredNoise === "cafeSounds" ? "selected" : ""
              }`}
              onClick={() => setPreferredNoise("cafeSounds")}
            >
              Cafe Sounds
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>Wheelchair Accessibility</h2>
          <div className="setting-options">
            <button
              className={`option-button ${
                wheelchairAccessible === true ? "selected" : ""
              }`}
              onClick={() => setWheelchairAccessible(true)}
            >
              True
            </button>
            <button
              className={`option-button ${
                wheelchairAccessible === false ? "selected" : ""
              }`}
              onClick={() => setWheelchairAccessible(false)}
            >
              False
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h2>App Theme</h2>
          <div className="setting-options">
            <button
              className={`option-button ${theme === "light" ? "selected" : ""}`}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              className={`option-button ${theme === "dark" ? "selected" : ""}`}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <Link
          to="/"
          className={`nav-icon ${currentPath === "/" ? "active" : ""}`}
        >
          <SearchIcon />
        </Link>
        <Link
          to="/bookmarks"
          className={`nav-icon ${currentPath === "/bookmarks" ? "active" : ""}`}
        >
          <BookmarkIcon />
        </Link>
        <Link
          to="/settings"
          className={`nav-icon ${currentPath === "/settings" ? "active" : ""}`}
        >
          <SettingsIcon />
        </Link>
      </div>
    </div>
   
  );
};

export default Settings;
