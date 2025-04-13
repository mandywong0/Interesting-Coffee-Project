import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import CafeMatch from './pages/CafeMatch/CafeMatch';
import MatchResults from './pages/MatchResults/MatchResults';
import CafeDetails from './pages/CafeDetails/CafeDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<CafeMatch />} />
          <Route path="/results" element={<MatchResults />} />
          <Route path="/cafe/:id" element={<CafeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
