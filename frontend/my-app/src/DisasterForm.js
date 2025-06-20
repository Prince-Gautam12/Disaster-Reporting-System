import React, { useState } from 'react';
import axios from 'axios';

const DisasterForm = ({ onDisasterAdded }) => {
  const [formData, setFormData] = useState({
    Title: '',
    location_name: '',
    description: '',
    tags: '',
    owner_id: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/disasters', formData);
      console.log('✅ Submitted:', res.data);
      alert('Disaster reported successfully ✅');

      setFormData({
        Title: '',
        location_name: '',
        description: '',
        tags: '',
        owner_id: '',
        location: ''
      });

      if (onDisasterAdded) {
        onDisasterAdded(); // Refresh the list
      }

    } catch (err) {
      console.error('❌ Submission error:', err); // more detailed
      alert('Failed to submit disaster ❌');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>🚨 Report a New Disaster</h2>

      {['Title', 'Location Name', 'Description', 'Tags', 'Owner_ID', 'Location'].map((field) => (
        <div key={field} style={{ marginBottom: '10px' }}>
          <label>{field.replace('_', ' ')}:</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
      ))}

      <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
    </form>
  );
};

export default DisasterForm;
