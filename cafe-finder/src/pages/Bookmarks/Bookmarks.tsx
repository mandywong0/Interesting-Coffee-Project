import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import cafesData from "../../data/cafes.json";
import { Cafe } from "../Home/Home";
import "../Home/Home.css";
import "./Bookmarks.css";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

interface CafeCardProps {
  cafe: Cafe;
  onClick: (id: number) => void;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, onClick }) => {
  const { id, name, images, about, vibeTags, uniqueItems, priceRange } = cafe;

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
        <div className="cafe-name">{name}</div>
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

        {priceRange && <span className="cafe-price-range">{priceRange}</span>}
      </div>
    </div>
  );
};

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();

  const bookmarkedCafeIds = JSON.parse(
    localStorage.getItem("bookmarkedCafes") || "[]"
  ) as number[];

  const cafes: Cafe[] = cafesData;

  const bookmarkedCafes = cafes.filter((cafe) =>
    bookmarkedCafeIds.includes(cafe.id)
  );

  const handleCafeClick = (id: number) => {
    navigate(`/cafe/${id}`);
  };
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="bookmarks-page">
      <h1 className="page-title" >Your Bookmarked Cafes</h1>

      <div className="bookmarks-cafe-list">
        {bookmarkedCafes.length === 0 ? (
          <p>
            <b className="no-bookmark-text">No bookmarks available. <br></br><br></br>Start saving your favorite cafes by clicking on the bookmark icon at the top left corner on the cafe's profile page!</b>
          </p>
        ) : (
          bookmarkedCafes.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} onClick={handleCafeClick} />
          ))
        )}
      </div>

      {/* Bottom Nav Bar */}
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

export default Bookmarks;
