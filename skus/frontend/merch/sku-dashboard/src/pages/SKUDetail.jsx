import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import debounce from 'lodash.debounce';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mocked user role
const role = 'brand_user'; // Change to 'merch_ops' to test other role
// Mock sales data
const mockSales = [20, 40, 35, 50, 45, 60, 55];

function SKUDetail() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [sku, setSku] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [salesActivities, setSalesActivities] = useState([]);
  const [returnActivities, setReturnActivities] = useState([]);
  const [contentScoreActivities, setContentScoreActivities] = useState([]);
  const [salesForm, setSalesForm] = useState({ quantity: '', date: '' });
  const [returnForm, setReturnForm] = useState({ quantity: '', date: '' });
  const [contentScoreForm, setContentScoreForm] = useState({ score: '', date: '' });
  const [activityError, setActivityError] = useState(null);

  useEffect(() => {
    fetchSKUDetails();
  }, [uuid]);

  useEffect(() => {
    if (sku && sku.uuid) {
      fetchActivities(sku.uuid);
    }
  }, [sku]);

  const fetchSKUDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/skus/${uuid}/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setSku(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching SKU details:', err);
      setError(
        err.response 
          ? `Error: ${err.response.status} - ${err.response.data.message || 'Failed to fetch SKU details'}`
          : 'Failed to connect to the server. Please check if the backend is running.'
      );
      setLoading(false);
    }
  };

  const fetchActivities = async (skuUuid) => {
    try {
      const [salesRes, returnRes, contentRes, notesRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/sales-activities/?sku=${skuUuid}`),
        axios.get(`http://localhost:8000/api/return-activities/?sku=${skuUuid}`),
        axios.get(`http://localhost:8000/api/content-score-activities/?sku=${skuUuid}`),
        axios.get(`http://localhost:8000/api/notes/?sku=${skuUuid}`),
      ]);
      setSalesActivities(salesRes.data);
      setReturnActivities(returnRes.data);
      setContentScoreActivities(contentRes.data);
      setNotes(notesRes.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  // Debounced auto-save for notes
  const debouncedSave = useCallback(
    debounce(async (noteText) => {
      setSaving(true);
      setSaveError(null);
      try {
        await axios.post('http://localhost:8000/api/notes/', {
          sku: uuid,
          content: noteText
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        // Fetch only notes after adding a new one
        const notesRes = await axios.get(`http://localhost:8000/api/notes/?sku=${uuid}`);
        setNotes(notesRes.data);
        setSaving(false);
      } catch (err) {
        console.error('Error adding note:', err);
        setSaveError(
          err.response 
            ? `Error: ${err.response.status} - ${err.response.data.message || 'Failed to add note'}`
            : 'Failed to connect to the server. Please try again.'
        );
        setSaving(false);
      }
    }, 1500), [uuid]);

  // Handle textarea change and trigger debounce
  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
    debouncedSave(e.target.value);
  };

  const handleActivityChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalesSubmit = async (e) => {
    e.preventDefault();
    setActivityError(null);
    try {
      await axios.post('http://localhost:8000/api/sales-activities/', {
        sku: sku.uuid,
        quantity: parseInt(salesForm.quantity, 10),
        date: new Date().toISOString().split('T')[0],
      });
      setSalesForm({ quantity: '', date: '' });
      fetchActivities(sku.uuid);
    } catch (err) {
      setActivityError('Failed to add sales activity.');
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setActivityError(null);
    try {
      await axios.post('http://localhost:8000/api/return-activities/', {
        sku: sku.uuid,
        quantity: parseInt(returnForm.quantity, 10),
        date: new Date().toISOString().split('T')[0],
      });
      setReturnForm({ quantity: '', date: '' });
      fetchActivities(sku.uuid);
    } catch (err) {
      setActivityError('Failed to add return activity.');
    }
  };

  const handleContentScoreSubmit = async (e) => {
    e.preventDefault();
    setActivityError(null);
    try {
      await axios.post('http://localhost:8000/api/content-score-activities/', {
        sku: sku.uuid,
        score: parseInt(contentScoreForm.score, 10),
        date: new Date().toISOString().split('T')[0],
      });
      setContentScoreForm({ score: '', date: '' });
      fetchActivities(sku.uuid);
    } catch (err) {
      setActivityError('Failed to add content score activity.');
    }
  };

  // Chart.js data (real sales data)
  // Aggregate sales by day for the last 7 days
  const getLastNDates = (n) => {
    const arr = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
    }
    return arr;
  };

  const last7Days = getLastNDates(7);
  const salesByDay = last7Days.map(dateStr => {
    return salesActivities
      .filter(act => act.date === dateStr)
      .reduce((sum, act) => sum + act.quantity, 0);
  });

  const chartData = {
    labels: last7Days.map(d => {
      const date = new Date(d);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Sales',
        data: salesByDay,
        backgroundColor: '#6ca0ff',
        borderRadius: 6,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { color: '#333' }, ticks: { color: '#a6c8ff' } },
      y: { grid: { color: '#333' }, ticks: { color: '#a6c8ff' } },
    },
  };

  if (loading) return <div className="loading">Loading SKU details...</div>;
  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={fetchSKUDetails}>Retry</button>
    </div>
  );
  if (!sku) return <div>SKU not found</div>;

  return (
    <div className="container sku-detail-page">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to List</button>
      <div className="sku-details card-section">
        <h2>{sku.name}</h2>
        <div className="sku-info-grid">
          <div><strong>SKU UUID:</strong> {sku.uuid}</div>
          <div><strong>Sales:</strong> {sku.sales}</div>
          <div><strong>Return %:</strong> {sku.return_percentage.toFixed(2)}%</div>
          <div><strong>Content Score:</strong> {sku.content_score.toFixed(2)}</div>
        </div>
        <div className="chart-section">
          <h3>Sales (Last 7 Days)</h3>
          <Bar data={chartData} options={chartOptions} height={180} />
        </div>
      </div>
      <div className="activity-section card-section">
        <h3>Sales Activities</h3>
        <form onSubmit={handleSalesSubmit} className="activity-form">
          <input type="number" name="quantity" min="1" placeholder="Quantity" value={salesForm.quantity} onChange={handleActivityChange(setSalesForm)} required />
          <button type="submit">Add Sale</button>
        </form>
        {salesActivities.length === 0 ? <div className="empty-msg">No sales activities.</div> : (
          <ul className="activity-list">
            {salesActivities.map(act => (
              <li key={act.id}>Qty: {act.quantity} <span className="activity-date">on {new Date(act.date).toLocaleString()}</span></li>
            ))}
          </ul>
        )}
        <h3>Return Activities</h3>
        <form onSubmit={handleReturnSubmit} className="activity-form">
          <input type="number" name="quantity" min="1" placeholder="Quantity" value={returnForm.quantity} onChange={handleActivityChange(setReturnForm)} required />
          <button type="submit">Add Return</button>
        </form>
        {returnActivities.length === 0 ? <div className="empty-msg">No return activities.</div> : (
          <ul className="activity-list">
            {returnActivities.map(act => (
              <li key={act.id}>Qty: {act.quantity} <span className="activity-date">on {new Date(act.date).toLocaleString()}</span></li>
            ))}
          </ul>
        )}
        <h3>Content Score Activities</h3>
        <form onSubmit={handleContentScoreSubmit} className="activity-form">
          <select name="score" value={contentScoreForm.score} onChange={handleActivityChange(setContentScoreForm)} required>
            <option value="">Score</option>
            {[...Array(10)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
          <button type="submit">Add Score</button>
        </form>
        {contentScoreActivities.length === 0 ? <div className="empty-msg">No content score activities.</div> : (
          <ul className="activity-list">
            {contentScoreActivities.map(act => (
              <li key={act.id}>Score: {act.score} <span className="activity-date">on {new Date(act.date).toLocaleString()}</span></li>
            ))}
          </ul>
        )}
        {activityError && <div className="error-msg">{activityError}</div>}
      </div>
      <div className="notes-section card-section">
        <h3>Notes</h3>
        {role === 'brand_user' && (
          <form onSubmit={e => e.preventDefault()} className="note-form">
            <textarea
              value={newNote}
              onChange={handleNoteChange}
              placeholder="Add a new note..."
              required
            />
            <div className="note-form-actions">
              {saving && <span className="saving-msg">Saving...</span>}
              {saveError && <span className="error-msg">{saveError}</span>}
            </div>
          </form>
        )}
        {role === 'merch_ops' && (
          <div className="empty-msg">(You do not have permission to add notes.)</div>
        )}
        <div className="notes-list">
          {notes.length === 0 && <div className="empty-msg">No notes yet.</div>}
          {notes.map((note) => (
            <div key={note.id} className="note">
              <p>{note.content}</p>
              <small>Added on: {new Date(note.created_at).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SKUDetail; 