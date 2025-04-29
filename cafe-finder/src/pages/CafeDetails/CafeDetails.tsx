import React, { useState, useEffect } from 'react';
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

const CafeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedCafes") || "[]");
    console.log(savedBookmarks);
    if (savedBookmarks.includes(Number(id))) {
      setIsBookmarked(true);
    }
  }, [id]);

  const showFlashMessage = (message: string) => {
    setFlashMessage(message);
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  };
  
  const navigate = useNavigate();

  const cafe = cafesData.find((c) => c.id === Number(id));
  if (!cafe) return <div>Cafe not found</div>;

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookmark = () => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedCafes") || "[]");
    let updatedBookmarks = [];

    if (savedBookmarks.includes(cafe.id)) {
      updatedBookmarks = savedBookmarks.filter((savedId: number) => savedId !== cafe.id);
      setIsBookmarked(false);
      showFlashMessage("Removed from bookmarks! 🔖");
    } else {
      updatedBookmarks = [...savedBookmarks, cafe.id];
      setIsBookmarked(true);
      showFlashMessage("Added to bookmarks! 🔖");
    }
    localStorage.setItem("bookmarkedCafes", JSON.stringify(updatedBookmarks));
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

    console.log(cafe.images);

    return daysOfWeek.map((day) => (
      <div key={day} className="hours-item">
        {day.charAt(0).toUpperCase() + day.slice(1)}: 
        <span>{cafe.hours[day as keyof typeof cafe.hours]}</span>
      </div>
    ));
  };

  return (
    <div className="cafe-details-page">
      {flashMessage && (
        <div className="flash-message">
          {flashMessage}
        </div>
      )}
      <div className="details-header">
        <button className="close-button" onClick={handleBack}>✕</button>
      </div>

      <div className="cafe-details-content">
        <div className="cafe-name-container">
          <button className="bookmark-button" onClick={handleBookmark}>
            <img src={isBookmarked ? "/bookmark-icon-clicked.png" : "/bookmark-icon-unclicked.png"} alt="Bookmark" className="bookmark-icon"/>

          </button>
          <h1 className="cafe-name-large">{cafe.name}</h1>
        </div>
        
        <div className="cafe-info-container">
          <Vibes vibes={cafe.vibeTags} />
          <ImageSlideshow images={[...(cafe.images.interior || []), ...(cafe.images.exterior || [])]} />
          <button className="menu-button" onClick={() => setShowMenu(true)}> Menu </button>
          
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
      {showMenu && (
        <div className="menu-modal">
          <button className="close-menu" onClick={() => setShowMenu(false)}>✕</button>
          <img src={cafe.images.menu} alt="Menu" className="menu-image" />
        </div>
      )}
    </div>
  );
};

export default CafeDetails; 