import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SKUDetail() {
  const { id } = useParams();
  const [sku, setSku] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkuDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/skus/${id}/`);
        setSku(response.data);
        setNotes(response.data.notes || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch SKU details');
        setLoading(false);
      }
    };

    fetchSkuDetails();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/notes/`, {
        sku_id: id,
        content: newNote
      });
      setNotes([...notes, response.data]);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!sku) return <div>SKU not found</div>;

  return (
    <div>
      <h1>SKU Details</h1>
      <h2>{sku.name}</h2>
      <p>SKU ID: {sku.id}</p>
      <p>Sales: {sku.sales}</p>
      <p>Return %: {sku.return_percentage}%</p>
      <p>Content Score: {sku.content_score}</p>

      <h3>Notes</h3>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>

      <div>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>
    </div>
  );
}

export default SKUDetail; 