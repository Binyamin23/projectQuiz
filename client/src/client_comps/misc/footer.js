import React from 'react';

export default function Footer() {
  return (
    <footer className='container-fluid' style={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#333',
      color: '#fff',
      padding: '1rem'
    }}>
      <p>Copyright © {new Date().getFullYear()} Code Quiz</p>
      <p>All rights reserved</p>
      <p>Contact us: <a href="mailto:benyaron@gmail.com" style={{ color: '#fff' }}>benyaron@gmail.com</a></p>
    </footer>
  );
};