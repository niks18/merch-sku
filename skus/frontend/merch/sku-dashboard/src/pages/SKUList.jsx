import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'High Return Rate (>30%)', value: 'high_return' },
  { label: 'Low Content Score (<6)', value: 'low_content' },
];

function SKUList() {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [addProductError, setAddProductError] = useState(null);

  useEffect(() => {
    fetchSKUs();
  }, []);

  const fetchSKUs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/skus/', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setSkus(response.data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response 
          ? `Error: ${err.response.status} - ${err.response.data.message || 'Failed to fetch SKUs'}`
          : 'Failed to connect to the server. Please check if the backend is running.'
      );
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddProductError(null);
    try {
      await axios.post('http://localhost:8000/api/skus/', {
        name: newProductName
      });
      setNewProductName('');
      setAddProductOpen(false);
      fetchSKUs();
    } catch (err) {
      setAddProductError('Failed to add product.');
    }
  };

  // Filter and search logic
  let filteredSkus = skus.filter((sku) =>
    sku.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === 'high_return') {
    filteredSkus = filteredSkus.filter((sku) => parseFloat(sku.return_percentage) > 30);
  } else if (filter === 'low_content') {
    filteredSkus = filteredSkus.filter((sku) => parseFloat(sku.content_score) < 6);
  }

  // Sorting logic
  if (sortConfig.key) {
    filteredSkus = [...filteredSkus].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="container sku-list-page">
      <h1>SKU Dashboard</h1>
      <div className="sku-list-controls">
        <button onClick={() => setAddProductOpen((v) => !v)} className="add-product-btn">
          {addProductOpen ? 'Cancel' : 'Add New Product'}
        </button>
        {addProductOpen && (
          <form onSubmit={handleAddProduct} className="add-product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={e => setNewProductName(e.target.value)}
              required
            />
            <button type="submit">Create</button>
            {addProductError && <span className="error-msg">{addProductError}</span>}
          </form>
        )}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {FILTERS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="card-section sku-list-table-card">
        {loading ? (
          <div className="loading">
            <span className="spinner" style={{ display: 'inline-block', width: 32, height: 32, border: '4px solid #6ca0ff', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
            <span style={{ marginLeft: 16 }}>Loading SKUs...</span>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={fetchSKUs}>Retry</button>
          </div>
        ) : (
          <table className="sku-list-table">
            <thead>
              <tr>
                <th>SKU UUID</th>
                <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('sales')}>Sales {sortConfig.key === 'sales' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('return_percentage')}>Return % {sortConfig.key === 'return_percentage' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
                <th onClick={() => handleSort('content_score')}>Content Score {sortConfig.key === 'content_score' && (sortConfig.direction === 'asc' ? '▲' : '▼')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkus.length === 0 ? (
                <tr><td colSpan={5} className="empty-msg">No SKUs found.</td></tr>
              ) : (
                filteredSkus.map((sku) => (
                  <tr key={sku.uuid}>
                    <td>
                      <Link to={`/sku/${sku.uuid}`}>{sku.uuid}</Link>
                    </td>
                    <td>{sku.name}</td>
                    <td>{sku.sales}</td>
                    <td>{sku.return_percentage.toFixed(2)}%</td>
                    <td>{sku.content_score.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default SKUList; 