import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CafeDetails.css';

interface VibeProps {
  vibes: string[];
}

const Vibes: React.FC<VibeProps> = ({ vibes }) => {
  return (
    <div className="vibes">
      {vibes.join(' - ')}
    </div>
  );
};

interface RatingBarProps {
  icon: string;
  value: number;
}

const RatingBar: React.FC<RatingBarProps> = ({ icon, value }) => {
  return (
    <div className="rating-bar-container">
      <div className="rating-icon">{icon}</div>
      <div className="rating-bar">
        <div className="rating-bar-fill" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  text: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ text }) => {
  return (
    <div className="detail-item">{text}</div>
  );
};

const CafeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const cafeData = {
    id: id,
    name: "Cafe Name",
    vibes: ["Vibe #1", "Vibe #2", "Vibe #3"],
    ratings: {
      wifi: 75,
      ambience: 60,
      food: 85
    },
    details: [
      "Open 8am - 10pm daily",
      "Located in Downtown",
      "Specialty: Cold Brew"
    ]
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookmark = () => {
    console.log("Bookmarked cafe:", cafeData.name);
  };

  return (
    <div className="cafe-details-page">
      <div className="details-header">
        <button className="bookmark-button" onClick={handleBookmark}>🔖</button>
        <button className="close-button" onClick={handleBack}>✕</button>
      </div>

      <div className="cafe-details-content">
        <div className="cafe-name-container">
          <h1 className="cafe-name-large">{cafeData.name}</h1>
        </div>
        
        <div className="cafe-info-container">
          <Vibes vibes={cafeData.vibes} />
          
          <div className="rating-bars">
            <RatingBar icon="📶" value={cafeData.ratings.wifi} />
            <RatingBar icon="👥" value={cafeData.ratings.ambience} />
            <RatingBar icon="📊" value={cafeData.ratings.food} />
          </div>
          
          <button className="menu-button">Menu</button>
          
          <div className="details-list">
            {cafeData.details.map((detail, index) => (
              <DetailItem key={index} text={detail} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetails; 