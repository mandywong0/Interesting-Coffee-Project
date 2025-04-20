import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MatchResults.css';

interface MatchedCafeProps {
  id: number;
  name: string;
  rating: number;
  labels: string[];
  onClick: (id: number) => void;
}

const MatchedCafe: React.FC<MatchedCafeProps> = ({ id, name, rating, labels, onClick }) => {
  const stars = '★'.repeat(rating);
  
  return (
    <div className="matched-cafe" onClick={() => onClick(id)}>
      <div className="cafe-header">
        <h3 className="cafe-name">{name}</h3>
        <div className="star-rating">{stars}</div>
      </div>
      
      <div className="label-container">
        {labels.map((label, index) => (
          <span key={index} className="label-tag">{label}</span>
        ))}
      </div>
    </div>
  );
};

const MatchResults: React.FC = () => {
  const navigate = useNavigate();
  
  const matchedCafes = [
    { 
      id: 1, 
      name: "Cafe #1", 
      rating: 5,
      labels: ["label", "label", "label", "label", "label", "label"]
    },
    { 
      id: 2, 
      name: "Cafe #2", 
      rating: 4,
      labels: ["label", "label", "label", "label", "label", "label"]
    },
    { 
      id: 3, 
      name: "Cafe #3", 
      rating: 4,
      labels: ["label", "label", "label", "label", "label", "label"]
    }
  ];

  const handleClose = () => {
    navigate('/');
  };

  const handleCafeClick = (id: number) => {
    navigate(`/cafe/${id}`);
  };

  return (
    <div className="match-results-page">
      <div className="modal-header">
        <h2 className="header-title">Top Matches</h2>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      
      <div className="results-list">
        {matchedCafes.map(cafe => (
          <MatchedCafe 
            key={cafe.id}
            id={cafe.id}
            name={cafe.name}
            rating={cafe.rating}
            labels={cafe.labels}
            onClick={handleCafeClick}
          />
        ))}
      </div>

      <div className="bottom-nav">
        <Link to="/" className="nav-icon">🔍</Link>
        <Link to="/match" className="nav-icon active">😊</Link>
        <Link to="/settings" className="nav-icon">⚙️</Link>
      </div>
    </div>
  );
};

export default MatchResults; 