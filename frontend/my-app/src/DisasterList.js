import React from 'react';

const DisasterList = ({ disasters, onDelete }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🌋 Reported Disasters</h2>

      {disasters && disasters.length > 0 ? (
        disasters.map((disaster, index) => (
          <div
            key={disaster.id || index}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <h3>{disaster.title} - {disaster.location_name}</h3>
            <p>{disaster.description}</p>
            <p><strong>Tags:</strong> {disaster.tags}</p>
            <p><strong>Location:</strong> {disaster.location}</p>

            <button
              onClick={() => onDelete(disaster.id)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No disasters reported yet.</p>
      )}
    </div>
  );
};

export default DisasterList;
