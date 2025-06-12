import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SKUList from './components/SKUList';
import SKUDetail from './components/SKUDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SKUList />} />
          <Route path="/sku/:id" element={<SKUDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 