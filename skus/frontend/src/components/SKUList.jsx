import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

// Main SKUList Component
function SKUList() {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/skus/`);
        // Ensure we have valid data
        const validSkus = response.data.map(sku => ({
          id: sku.id || '',
          uuid: sku.uuid || '',
          name: sku.name || 'N/A',
          sales: sku.sales || 0,
          content_score: sku.content_score || 0
        }));
        setSkus(validSkus);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching SKUs:', err);
        setError('Failed to fetch SKUs. Please try again later.');
        setLoading(false);
      }
    };

    fetchSkus();
  }, []);

  if (loading) {
    return <div>Loading SKUs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!skus.length) {
    return <div>No SKUs found.</div>;
  }

  return (
    <ErrorBoundary>
      <div className="sku-list">
        <h1>SKU List</h1>
        <table>
          <thead>
            <tr>
              <th>SKU ID</th>
              <th>Name</th>
              <th>Sales</th>
              <th>Content Score</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((sku) => (
              <tr key={sku.id || sku.uuid}>
                <td><Link to={`/sku/${sku.id || sku.uuid}`}>{sku.id || sku.uuid}</Link></td>
                <td>{sku.name}</td>
                <td>{sku.sales}</td>
                <td>{sku.content_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default SKUList; 