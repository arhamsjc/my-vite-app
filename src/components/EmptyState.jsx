import React from 'react';

export const EmptyState = () => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: '200px',
        textAlign: 'center',
        color: '#666'
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: '1rem' }}
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
      <h3 style={{ margin: '0 0 0.5rem 0' }}>No results found</h3>
      <p style={{ margin: 0 }}>Try adjusting your filters to find what you're looking for.</p>
    </div>
  );
};