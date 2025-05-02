import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import cafesData from "../../data/cafes.json";
import { useSettings } from "../../context/SettingsContext";
import { useSearch } from "../../context/SearchContext";

export interface Cafe {
  id: number;
  name: string;
  images: {
    exterior: string[];
    interior: string[];
  };
  uniqueItems: string[];
  menuItems: string[];
  about: string | null;
  tags: string[];
  address: string;
  phone: string | null;
  website: string | null;
  reviews: string[];
  vibeTags: string[];
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
  showScore?: boolean;
  relevanceScore?: number;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, onClick, showScore = false, relevanceScore = 0 }) => {
  const { id, name, images, about, tags, vibeTags, uniqueItems, priceRange } = cafe;

  const ignoredWords = ["cafe", "coffee", "caffe", "the", "a"];

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
          src={`/images/${folderName}/exterior1.jpg`}
          alt={`${name} exterior`}
          className="cafe-image"
        />
      )}

      <div className="cafe-info">
        <div className="cafe-header">
          <div className="cafe-name">{name}</div>
          {showScore && (
            <div className="cafe-score">
              <span className="score-value">{relevanceScore.toFixed(1)}</span>
              <span className="score-label">/10</span>
            </div>
          )}
        </div>
        <div className="cafe-tags">
          {vibeTags.map((tag, idx) => (
            <span key={idx} className="cafe-tag">
              {tag}
            </span>
          ))}
        </div>
        {about && <p className="cafe-about">{about}</p>}

        <div className="cafe-unique-items" >
          {uniqueItems.length > 0 && (
            <p>
              <strong>Signature Menu Items:</strong> {uniqueItems.join(", ")}
            </p>
          )}
        </div>

        <div className="cafe-footer">
          {priceRange && <span className="cafe-price-range">{priceRange}</span>}
          {showScore && relevanceScore >= 8 && (
            <span className="cafe-match-label">Perfect Match</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const cafes: Cafe[] = cafesData;
  const { preferredSeating, preferredPayment, pricePreference } = useSettings();
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    error, 
    performSearch, 
    getRelevanceScore 
  } = useSearch();
  const [inputValue, setInputValue] = useState("");

  const handleCafeClick = (id: number) => {
    navigate(`/cafe/${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Filter cafes based on user preferences
  const filteredCafes = cafes.filter((cafe) => {
    if (pricePreference === "$$" && cafe.priceRange !== "$$") {
      return false;
    }

    if (preferredSeating === "outdoor" && !cafe.amenities.outdoorSeating) {
      return false;
    }

    if (preferredPayment === "creditCard" && !cafe.amenities.creditCards) {
      return false;
    }

    return true;
  });

  // Show search results if there's a search query, otherwise show filtered cafes
  const displayedCafes = searchQuery ? searchResults : filteredCafes;

  return (
    <div className="home-page">
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Ask anything (e.g., 'quiet place with good pastries')" 
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="search-error">{error}</div>}

      {isSearching ? (
        <div className="loading-indicator">Searching for cafes...</div>
      ) : (
        <>
          <h2 className="section-title">
            {searchQuery ? `Results for "${searchQuery}"` : "Recommended For You:"}
          </h2>

          {displayedCafes.length === 0 ? (
            <div className="no-results">
              {searchQuery ? "No cafes match your search. Try different keywords." : "No cafes match your preferences."}
            </div>
          ) : (
            <div className="cafe-list">
              {displayedCafes.map((cafe) => (
                <CafeCard
                  key={cafe.id}
                  id={cafe.id}
                  cafe={cafe}
                  onClick={handleCafeClick}
                  showScore={searchQuery ? true : false}
                  relevanceScore={getRelevanceScore(cafe.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="bottom-nav">
        <Link to="/" className="nav-icon active">
          🔍
        </Link>
        <Link to="/bookmarks" className="nav-icon">
          🔖
        </Link>
        <Link to="/settings" className="nav-icon">
          ⚙️
        </Link>
      </div>
    </div>
  );
};

export default Home;
