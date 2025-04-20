import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import cafesData from "../../data/cafes.json";
import { useSettings } from "../../context/SettingsContext";

export interface Cafe {
  id: number;
  name: string;
  images: {
    exterior: string[];
    interior: string[];
  };
  uniqueItems: string[];
  about: string | null;
  tags: string[];
  address: string;
  phone: string | null;
  website: string | null;
  reviews: string[];
  amenities: {
    bathroom: boolean | null;
    wifi: boolean | null;
    indoorSeating: boolean | null;
    outdoorSeating: boolean | null;
    wheelchairAccessible: boolean | null;
    outlets: boolean | null;
    creditCards: boolean | null;
  };
  priceRange: string | null;
  hours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  yelp: string;
}

interface CafeCardProps {
  id: number;
  cafe: Cafe;
  onClick: (id: number) => void;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, onClick }) => {
  const { id, name, images, about, tags, uniqueItems, priceRange } = cafe;

  const ignoredWords = ["cafe", "coffee", "caffe", "the"];

  const words = cafe.name.split(" ");
  let firstMeaningfulWord = words[0];

  for (let i = 0; i < words.length; i++) {
    if (!ignoredWords.includes(words[i].toLowerCase())) {
      firstMeaningfulWord = words[i];
      break;
    }
  }

  const folderName = firstMeaningfulWord.toLowerCase();
  return (
    <div className="cafe-card" onClick={() => onClick(id)}>
      {images.exterior?.[0] && (
        <img
          src={`/${folderName}/exterior1.jpg`}
          alt={`${name} exterior`}
          className="cafe-image"
        />
      )}

      <div className="cafe-info">
        <h3 className="cafe-name">{name}</h3>
        {priceRange && <span className="cafe-price-range">{priceRange}</span>}

        {about && <p className="cafe-about">{about}</p>}

        <div className="cafe-unique-items">
          {uniqueItems.length > 0 && (
            <p>
              <strong>Signature Menu Items:</strong> {uniqueItems.join(", ")}
            </p>
          )}
        </div>

        <div className="cafe-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="cafe-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const cafes: Cafe[] = cafesData;
  const { preferredSeating, preferredPayment, pricePreference } = useSettings();

  const handleCafeClick = (id: number) => {
    navigate(`/cafe/${id}`);
  };

  const filteredCafes = cafes.filter(cafe => {
    if (pricePreference === '$$' && cafe.priceRange !== '$$') {
      return false;
    }
    
    if (preferredSeating === 'outdoor' && !cafe.amenities.outdoorSeating) {
      return false;
    }
    
    if (preferredPayment === 'creditCard' && !cafe.amenities.creditCards) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="home-page">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="keywords" />
      </div>

      <h2 className="section-title">Recommended For You:</h2>

      <div className="cafe-list">
        {filteredCafes.map((cafe) => (
          <CafeCard
            key={cafe.id}
            id={cafe.id}
            cafe={cafe}
            onClick={handleCafeClick}
          />
        ))}
      </div>

      <div className="bottom-nav">
        <Link to="/" className="nav-icon active">
          🔍
        </Link>
        <Link to="/match" className="nav-icon">
          😊
        </Link>
        <Link to="/settings" className="nav-icon">
          ⚙️
        </Link>
      </div>
    </div>
  );
};

export default Home;
