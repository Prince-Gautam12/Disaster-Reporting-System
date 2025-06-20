import React, { useEffect, useState } from 'react';
import DisasterList from './DisasterList';
import DisasterForm from './DisasterForm';
import axios from 'axios';
import { io } from 'socket.io-client';

function App() {
  const [disasters, setDisasters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const socket = io('http://localhost:5000'); // ✅ Connect to backend

  const fetchDisasters = () => {
    fetch('http://localhost:5000/api/disasters')
      .then(res => res.json())
      .then(data => setDisasters(data.data || []));
  };

  useEffect(() => {
    fetchDisasters();

    // 👂 Listen for real-time updates
    socket.on('new_disaster', (newDisaster) => {
      console.log('📡 New disaster received via socket:', newDisaster);
      setDisasters(prev => [newDisaster, ...prev]);
    });

    // Cleanup socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/disasters/${id}`);
      alert('🗑️ Deleted successfully!');
      fetchDisasters(); // Refresh the list
    } catch (err) {
      console.error('Delete failed:', err);
      alert('❌ Failed to delete disaster.');
    }
  };

  const filteredDisasters = disasters.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <DisasterForm onDisasterAdded={fetchDisasters} />

      <hr />

      {/* 🔍 Search bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search disasters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>

      <DisasterList disasters={filteredDisasters} onDelete={handleDelete} />
    </div>
  );
}

export default App;
