import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CafeMatch.css';

const CafeMatch: React.FC = () => {
  const [preference, setPreference] = useState('');
  const navigate = useNavigate();

  const handleMatchClick = () => {
    navigate('/results');
  };

  return (
    <div className="cafe-match-page">
      <h1 className="page-title">Get Your Cafe Match</h1>
      
      <textarea 
        className="input-area" 
        placeholder="Describe what you're looking for..."
        value={preference}
        onChange={(e) => setPreference(e.target.value)}
      />
      
      <button className="match-button" onClick={handleMatchClick}>
        MATCH ME
      </button>
      
      <div className="bottom-nav">
        <Link to="/" className="nav-icon">🔍</Link>
        <Link to="/match" className="nav-icon active">😊</Link>
      </div>
    </div>
  );
};

export default CafeMatch; 