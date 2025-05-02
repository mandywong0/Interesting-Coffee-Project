import React, { createContext, useState, useContext, ReactNode } from "react";
import { Cafe } from "../pages/Home/Home";
import { searchCafesWithNaturalLanguage } from "../services/searchService";
import cafesData from "../data/cafes.json";
import { useSettings } from "./SettingsContext";

interface SearchContextType {
  searchQuery: string;
  searchResults: Cafe[];
  isSearching: boolean;
  error: string | null;
  relevanceScores: Map<number, number>;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  getRelevanceScore: (cafeId: number) => number;
}

const defaultSearchContext: SearchContextType = {
  searchQuery: "",
  searchResults: [],
  isSearching: false,
  error: null,
  relevanceScores: new Map(),
  setSearchQuery: () => {},
  performSearch: async () => {},
  clearSearch: () => {},
  getRelevanceScore: () => 0,
};

export const SearchContext = createContext<SearchContextType>(defaultSearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Cafe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relevanceScores, setRelevanceScores] = useState<Map<number, number>>(new Map());
  
  // Get user preferences from settings context
  const { 
    preferredSeating,
    preferredPayment,
    preferredNoise,
    pricePreference,
    wheelchairAccessible
  } = useSettings();

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setRelevanceScores(new Map());
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchQuery(query);

    try {
      const cafes = cafesData as Cafe[];
      
      // Pass user preferences to the search function
      const userPreferences = {
        preferredSeating,
        preferredPayment,
        preferredNoise,
        pricePreference,
        wheelchairAccessible
      };
      
      const results = await searchCafesWithNaturalLanguage(query, cafes, userPreferences);
      setSearchResults(results.cafes);
      setRelevanceScores(results.scores);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to perform search. Please try again.");
      setSearchResults([]);
      setRelevanceScores(new Map());
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setRelevanceScores(new Map());
    setError(null);
  };
  
  const getRelevanceScore = (cafeId: number): number => {
    return relevanceScores.get(cafeId) || 0;
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        error,
        relevanceScores,
        setSearchQuery,
        performSearch,
        clearSearch,
        getRelevanceScore,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext); 