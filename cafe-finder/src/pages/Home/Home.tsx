import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

interface CafeCardProps {
  id: number;
  name: string;
  matchPercentage: number;
  onClick: (id: number) => void;
}

const CafeCard: React.FC<CafeCardProps> = ({ id, name, matchPercentage, onClick }) => {
  return (
    <div className="cafe-card" onClick={() => onClick(id)}>
      <div className="cafe-info">
        <div className="cafe-name">{name}</div>
        <div className="match-percentage">{matchPercentage}%</div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const recommendedCafes = [
    { id: 1, name: "Cafe #1", matchPercentage: 95 },
    { id: 2, name: "Cafe #2", matchPercentage: 87 },
    { id: 3, name: "Cafe #3", matchPercentage: 78 },
  ];

  const handleCafeClick = (id: number) => {
    navigate(`/cafe/${id}`);
  };

  return (
    <div className="home-page">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="keywords" />
      </div>
      
      <h2 className="section-title">Recommended For You:</h2>
      
      <div className="cafe-list">
        {recommendedCafes.map(cafe => (
          <CafeCard 
            key={cafe.id}
            id={cafe.id}
            name={cafe.name}
            matchPercentage={cafe.matchPercentage}
            onClick={handleCafeClick}
          />
        ))}
      </div>
      
      <div className="bottom-nav">
        <Link to="/" className="nav-icon active">🔍</Link>
        <Link to="/match" className="nav-icon">😊</Link>
      </div>
    </div>
  );
};

export default Home; 