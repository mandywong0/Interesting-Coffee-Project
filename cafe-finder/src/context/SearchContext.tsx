import React, { createContext, useState, useContext, ReactNode, useRef, useCallback } from "react";
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
  
  const searchRequestRef = useRef<number>(0);
  
  const { 
    preferredSeating,
    preferredPayment,
    preferredNoise,
    pricePreference,
    wheelchairAccessible
  } = useSettings();

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setRelevanceScores(new Map());
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchQuery(query);

    const currentRequest = ++searchRequestRef.current;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentRequest !== searchRequestRef.current) {
        console.log("Search request superseded by newer request");
        return;
      }

      const cafes = cafesData as Cafe[];
      
      const userPreferences = {
        preferredSeating,
        preferredPayment,
        preferredNoise,
        pricePreference,
        wheelchairAccessible
      };
      
      const results = await searchCafesWithNaturalLanguage(query, cafes, userPreferences);
      
      if (currentRequest === searchRequestRef.current) {
        setSearchResults(results.cafes);
        setRelevanceScores(results.scores);
      }
    } catch (err: any) {
      console.error("Search failed:", err);
      
      if (currentRequest === searchRequestRef.current) {
        if (err.message === "API key missing") {
          setError("OpenAI API key is missing. Please add it to your .env file.");
        } else {
          setError("Failed to perform search. Please try again later.");
        }
        setSearchResults([]);
        setRelevanceScores(new Map());
      }
    } finally {
      if (currentRequest === searchRequestRef.current) {
        setIsSearching(false);
      }
    }
  }, [preferredSeating, preferredPayment, preferredNoise, pricePreference, wheelchairAccessible]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setRelevanceScores(new Map());
    setError(null);
    ++searchRequestRef.current;
  }, []);
  
  const getRelevanceScore = useCallback((cafeId: number): number => {
    return relevanceScores.get(cafeId) || 0;
  }, [relevanceScores]);

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