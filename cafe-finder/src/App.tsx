import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import CafeMatch from './pages/CafeMatch/CafeMatch';
import MatchResults from './pages/MatchResults/MatchResults';
import CafeDetails from './pages/CafeDetails/CafeDetails';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Settings from './pages/Settings/Settings';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { SearchProvider } from './context/SearchContext';

const AppContent = () => {
  const { theme } = useSettings();
  
  useEffect(() => {
    // Apply theme class to the body element
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
  }, [theme]);
  
  return (
    <div className={`App ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<CafeMatch />} />
        <Route path="/results" element={<MatchResults />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/cafe/:id" element={<CafeDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <SearchProvider>
        <Router>
          <AppContent />
        </Router>
      </SearchProvider>
    </SettingsProvider>
  );
}

export default App;
