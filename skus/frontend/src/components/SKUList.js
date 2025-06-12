import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SKUList() {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/skus/`);
        setSkus(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch SKUs');
        setLoading(false);
      }
    };

    fetchSkus();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>SKU List</h1>
      <table>
        <thead>
          <tr>
            <th>SKU ID</th>
            <th>Name</th>
            <th>Sales</th>
            <th>Return %</th>
            <th>Content Score</th>
          </tr>
        </thead>
        <tbody>
          {skus.map((sku) => (
            <tr key={sku.id}>
              <td><Link to={`/sku/${sku.id}`}>{sku.id}</Link></td>
              <td>{sku.name}</td>
              <td>{sku.sales}</td>
              <td>{sku.return_percentage}%</td>
              <td>{sku.content_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SKUList; 