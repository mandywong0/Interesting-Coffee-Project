import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CafeDetails.css';
import cafesData from "../../data/cafes.json";
import ImageSlideshow from '../../components/imageSlideshow';

interface VibeProps {
  vibes: string[];
}

const Vibes: React.FC<VibeProps> = ({ vibes }) => {
  return (
    <div className="vibes">
      {vibes.join(' • ')}
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

  const cafe = cafesData.find((c) => c.id === Number(id));
  if (!cafe) return <div>Cafe not found</div>;

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookmark = () => {
    console.log("Bookmarked cafe:", cafe.name);
  };

  const renderAmenities = (amenities: { [key: string]: boolean | null }) =>
    Object.entries(amenities).map(
      ([amenity, isAvailable]) =>
        isAvailable !== null && (
          <div className="amenity-row" key={amenity}>
            <span className="amenity-name">
              {amenity.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, char => char.toUpperCase())}
            </span>
            <span className={`amenity-symbol ${isAvailable ? '' : 'unavailable'}`}>
              {isAvailable ? '✔' : '✘'}
            </span>
          </div>
        )
    );

  const renderHours = () => {
    const daysOfWeek = [
      'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
    ];

    return daysOfWeek.map((day) => (
      <div key={day} className="hours-item">
        {day.charAt(0).toUpperCase() + day.slice(1)}: 
        <span>{cafe.hours[day as keyof typeof cafe.hours]}</span>
      </div>
    ));
  };

  return (
    <div className="cafe-details-page">
      <div className="details-header">
        <button className="bookmark-button" onClick={handleBookmark}>🔖</button>
        <button className="close-button" onClick={handleBack}>✕</button>
      </div>

      <div className="cafe-details-content">
        <div className="cafe-name-container">
          <h1 className="cafe-name-large">{cafe.name}</h1>
        </div>
        
        <div className="cafe-info-container">
          <Vibes vibes={cafe.vibeTags} />
          <ImageSlideshow images={cafe.images.interior || []} />
          <a className="menu-button-link" href={cafe.images.menu} target="_blank" rel="noopener noreferrer">
            <button className="menu-button">Menu</button>
          </a>
          
          <div className="amenities-list">
          {renderAmenities(cafe.amenities)}
          </div>

          <div className="details-list">
            <div className="detail-item"><strong>Hours:</strong>{renderHours()}</div>
            <div className="detail-item"><strong>Location:</strong><span className="detail-item-body">{cafe.address}</span></div>
            {cafe.uniqueItems.length > 0 && (
              <div className="detail-item"><strong>Specialty:</strong><span className="detail-item-body">{cafe.uniqueItems.join(", ")}</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetails; 