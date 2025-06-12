import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SKUList from './pages/SKUList';
import SKUDetail from './pages/SKUDetail';
import './App.css'

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<SKUList />} />
          <Route path="/sku/:uuid" element={<SKUDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
