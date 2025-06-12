import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'High Return Rate (>30%)', value: 'high_return' },
  { label: 'Low Content Score (<6)', value: 'low_content' },
];

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px'
  },
  loadingSpinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#fff3f3',
    borderRadius: '8px',
    margin: '20px 0'
  },
  errorMessage: {
    color: '#e74c3c',
    marginBottom: '16px'
  },
  skuList: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  searchBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    alignItems: 'center'
  },
  searchInput: {
    padding: '10px 16px',
    width: '300px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#222',
    transition: 'all 0.3s ease',
    '::placeholder': {
      color: '#888',
      opacity: 1
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
    }
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  },
  addButton: {
    backgroundColor: '#2ecc71',
    color: 'white',
    '&:hover': {
      backgroundColor: '#27ae60'
    }
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '6px 12px',
    '&:hover': {
      backgroundColor: '#c0392b'
    }
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  tableHeader: {
    padding: '16px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: '14px',
    borderBottom: '2px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#e9ecef'
    }
  },
  tableCell: {
    padding: '16px',
    textAlign: 'left',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '14px',
    color: '#2c3e50'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6c757d',
    padding: '32px',
    fontSize: '14px'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    width: '400px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px'
  },
  modalInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#222',
    boxSizing: 'border-box',
    '::placeholder': {
      color: '#888',
      opacity: 1
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
    }
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px'
  }
};

function SKUList() {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [addProductError, setAddProductError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchSkus();
  }, []);

  const fetchSkus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/skus/`);
      
      // Ensure we have an array of valid SKUs
      const validSkus = Array.isArray(response.data) ? response.data.map(sku => ({
        uuid: sku.uuid || '',
        name: sku.name || 'N/A',
        sales: Number(sku.sales) || 0,
        content_score: Number(sku.content_score) || 0
      })) : [];
      
      setSkus(validSkus);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch SKUs. Please try again later.');
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddProductError(null);
    try {
      await axios.post(`${API_BASE_URL}/api/skus/`, {
        name: newProductName
      });
      setNewProductName('');
      setAddProductOpen(false);
      fetchSkus();
    } catch (err) {
      setAddProductError('Failed to add product. Please try again.');
    }
  };

  const handleDelete = async (uuid) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/skus/${uuid}/`);
        fetchSkus();
      } catch (err) {
        setDeleteError('Failed to delete product. Please try again.');
      }
    }
  };

  // Ensure we're working with an array and filter safely
  const filteredSkus = Array.isArray(skus) ? skus.filter(sku => {
    if (!sku) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (sku.name || '').toLowerCase().includes(searchLower) ||
      (sku.uuid || '').toString().includes(searchLower)
    );
  }) : [];

  // Sort the filtered SKUs
  const sortedSkus = [...filteredSkus].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading SKUs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={styles.skuList}>
      <div style={styles.header}>
        <h1 style={styles.title}>SKU List</h1>
      </div>
      {deleteError && (
        <div style={styles.errorContainer}>
          <p style={styles.errorMessage}>{deleteError}</p>
        </div>
      )}
      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search SKUs..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        <button 
          onClick={() => setAddProductOpen(true)}
          style={{...styles.button, ...styles.addButton}}
        >
          Add New Product
        </button>
      </div>

      {addProductOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Product Name"
                style={styles.modalInput}
                required
              />
              {addProductError && (
                <div style={{ color: '#e74c3c', marginBottom: '16px' }}>{addProductError}</div>
              )}
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setAddProductOpen(false)}
                  style={{...styles.button, backgroundColor: '#95a5a6', color: 'white'}}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{...styles.button, ...styles.addButton}}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>SKU ID</th>
            <th 
              style={styles.tableHeader}
              onClick={() => handleSort('name')}
            >
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th 
              style={styles.tableHeader}
              onClick={() => handleSort('sales')}
            >
              Sales {sortConfig.key === 'sales' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th 
              style={styles.tableHeader}
              onClick={() => handleSort('content_score')}
            >
              Content Score {sortConfig.key === 'content_score' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedSkus.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.emptyMessage}>No SKUs found.</td>
            </tr>
          ) : (
            sortedSkus.map((sku) => (
              <tr key={sku.uuid}>
                <td style={styles.tableCell}>
                  <Link to={`/sku/${sku.uuid}`} style={styles.link}>{sku.uuid}</Link>
                </td>
                <td style={styles.tableCell}>{sku.name}</td>
                <td style={styles.tableCell}>{sku.sales}</td>
                <td style={styles.tableCell}>{sku.content_score}</td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => handleDelete(sku.uuid)}
                    style={{...styles.button, ...styles.deleteButton}}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SKUList; 