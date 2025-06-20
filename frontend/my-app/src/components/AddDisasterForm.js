import React, { useState } from 'react';

const AddDisasterForm = ({ onDisasterAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    location_name: '',
    description: '',
    tags: '',
    owner_id: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/disasters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      alert('✅ Disaster reported successfully');
      setFormData({
        title: '',
        location_name: '',
        description: '',
        tags: '',
        owner_id: '',
        location: ''
      });
      onDisasterAdded(); // Refresh the list
    } else {
      alert('❌ Failed to report disaster');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>🆕 Report a New Disaster</h2>
      <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <input type="text" name="location_name" placeholder="Location Name" value={formData.location_name} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
      <input type="text" name="owner_id" placeholder="Owner ID" value={formData.owner_id} onChange={handleChange} />
      <input type="text" name="location" placeholder="Location (lat,long)" value={formData.location} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddDisasterForm;
