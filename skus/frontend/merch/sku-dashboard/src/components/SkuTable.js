import React, { useEffect, useState } from 'react';
import { skuService } from '../api/skuService';

const SkuTable = () => {
  const [skus, setSkus] = useState([]);

  useEffect(() => {
    skuService.getAllSkus().then(setSkus);
  }, []);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#18181b', color: '#fff' }}>
      <thead>
        <tr style={{ background: '#23232a' }}>
          <th style={{ padding: '12px', border: '1px solid #333' }}>SKU UUID</th>
          <th style={{ padding: '12px', border: '1px solid #333' }}>Name</th>
          <th style={{ padding: '12px', border: '1px solid #333' }}>Sales</th>
          <th style={{ padding: '12px', border: '1px solid #333' }}>Return %</th>
          <th style={{ padding: '12px', border: '1px solid #333' }}>Content Score</th>
        </tr>
      </thead>
      <tbody>
        {skus.map((sku) => (
          <tr key={sku.uuid} style={{ borderBottom: '1px solid #333' }}>
            <td style={{ padding: '10px', border: '1px solid #333', fontFamily: 'monospace', fontSize: '0.9em' }}>{sku.uuid}</td>
            <td style={{ padding: '10px', border: '1px solid #333' }}>{sku.name}</td>
            <td style={{ padding: '10px', border: '1px solid #333' }}>{sku.sales}</td>
            <td style={{ padding: '10px', border: '1px solid #333' }}>{sku.return_percentage} %</td>
            <td style={{ padding: '10px', border: '1px solid #333' }}>{sku.content_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SkuTable; 