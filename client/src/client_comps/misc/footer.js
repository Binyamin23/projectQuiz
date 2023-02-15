import React from 'react';

export default function Footer() {
  return (
    <div className='container-fluid' style={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#333',
      color: '#fff',
      padding: '1rem'
    }}>
      <p>Copyright © {new Date().getFullYear()} Your Company Name</p>
      <p>All rights reserved</p>
      <p>Contact us: <a href="mailto:info@yourcompany.com" style={{ color: '#fff' }}>info@yourcompany.com</a></p>
    </div>
  );
};