import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Home.css";
import cafesData from "../../data/cafes.json";
import { useSettings } from "../../context/SettingsContext";
import { useSearch } from "../../context/SearchContext";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

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

const CafeCard: React.FC<CafeCardProps> = ({
  cafe,
  onClick,
  showScore = false,
  relevanceScore = 0,
}) => {
  const { id, name, images, about, tags, vibeTags, uniqueItems, priceRange } =
    cafe;

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

        <div className="cafe-unique-items">
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

// Common search suggestion categories
const searchSuggestions = [
  {
    category: "Popular",
    suggestions: [
      "Study spot",
      "Best coffee",
      "Quiet place",
      "Good wifi",
      "Cozy atmosphere",
    ],
  },
  {
    category: "Vibe",
    suggestions: ["Cozy", "Quiet", "Hipster", "Artsy", "Modern"],
  },
  {
    category: "Drinks",
    suggestions: ["Tea", "Espresso", "Latte", "Cold Brew", "Matcha"],
  },
  {
    category: "Food",
    suggestions: ["Pastries", "Avocado Toast", "Vegan", "Gluten-Free"],
  },
  {
    category: "Features",
    suggestions: ["Wifi", "Outlets", "Outdoor Seating", "Study Spot"],
  },
];

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
    getRelevanceScore,
    clearSearch,
  } = useSearch();
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const currentPath = location.pathname;

  // Refs for debouncing search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "typing" | "debouncing" | "searching"
  >("idle");

  // Handle user navigating to cafe details
  const handleCafeClick = (id: number) => {
    navigate(`/cafe/${id}`);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any pending debounced searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Only search if there's something to search for
    if (inputValue.trim()) {
      setSearchStatus("searching");
      performSearch(inputValue);
    }
  };

  // Handle input changes with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchStatus("typing");

    // If user clears the input, also clear the search results
    if (value === "") {
      clearSearch();
      setSearchStatus("idle");
      return;
    }

    // Clear any pending debounced searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set up a new debounced search
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        setSearchStatus("debouncing");
        performSearch(value);
      }
    }, 800); // Wait 800ms after user stops typing before searching
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    // If input is empty, just use the suggestion
    // If input already has text, add the suggestion with a space before it
    const newValue = inputValue
      ? `${inputValue} ${suggestion.toLowerCase()}`
      : suggestion.toLowerCase();

    // Only update the input value, don't trigger search
    setInputValue(newValue);

    // Flash feedback to user
    const searchInput = document.querySelector(
      ".search-bar input"
    ) as HTMLInputElement;
    if (searchInput) {
      // Focus the input
      searchInput.focus();

      // Flash the search button to indicate next step
      const searchButton = document.querySelector(".search-button");
      if (searchButton) {
        searchButton.classList.add("flash-animation");
        setTimeout(() => {
          searchButton.classList.remove("flash-animation");
        }, 500);
      }
    }
  };

  // Update search status when isSearching changes
  useEffect(() => {
    if (isSearching) {
      setSearchStatus("searching");
    } else if (searchStatus === "searching" || searchStatus === "debouncing") {
      setSearchStatus("idle");
    }
  }, [isSearching, searchStatus]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  return (
    <div className="home-page">
      <div className="search-container">
        <form className="search-bar" onSubmit={handleSearchSubmit} style={{
          borderBottomLeftRadius: showSearchSuggestions ? "0" : "20px",
          borderBottomRightRadius: showSearchSuggestions ? "0" : "20px",
        }}>
          <span className="search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Ask anything (e.g., 'quiet place with good pastries')"
            
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSearchSuggestions(true)}
            onBlur={(e) => {
              const relatedTarget = e.relatedTarget as HTMLElement | null;
              if (
                relatedTarget &&
                relatedTarget.closest(".search-suggestions")
              ) {
                return;
              }
              setTimeout(() => setShowSearchSuggestions(false), 100);
            }}
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {showSearchSuggestions && (
          <div className="search-suggestions">
            <div className="search-hint">
              Click keywords to add to your search, then press{" "}
              <strong>Search</strong> to find cafes
            </div>
            {searchSuggestions.map((category, idx) => (
              <div key={idx} className="suggestion-category">
                <div className="category-title">{category.category}</div>
                <div className="suggestion-buttons">
                  {category.suggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      className="suggestion-button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      title="Add to search"
                    >
                      <span className="add-symbol">+</span> {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show search feedback */}
      {searchStatus === "typing" && inputValue.length > 0 && (
        <div className="search-feedback">
          Type more or press Enter to search
        </div>
      )}

      {searchStatus === "debouncing" && (
        <div className="search-feedback">Preparing search...</div>
      )}

      {error && <div className="search-error">{error}</div>}

      {isSearching ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <div>Searching for cafes...</div>
        </div>
      ) : (
        <>
          <h2 className="section-title">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : "Recommended For You:"}
          </h2>

          {displayedCafes.length === 0 ? (
            <div className="no-results">
              {searchQuery
                ? "No cafes match your search. Try different keywords."
                : "No cafes match your preferences."}
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

      {/* Debug button only shown in development */}
      {process.env.NODE_ENV === "development" && (
        <button
          className="debug-button"
          onClick={() => {
            const currentValue = localStorage.getItem("MOCK_API") === "true";
            localStorage.setItem("MOCK_API", (!currentValue).toString());
            // Set the environment variable for the current session
            (window as any).REACT_APP_MOCK_API = (!currentValue).toString();
            alert(
              `Mock API mode ${
                !currentValue ? "enabled" : "disabled"
              }. Refresh the page to apply.`
            );
          }}
        >
          {localStorage.getItem("MOCK_API") === "true" ? "Disable" : "Enable"}{" "}
          Mock API
        </button>
      )}
    </div>
  );
};

export default Home;
