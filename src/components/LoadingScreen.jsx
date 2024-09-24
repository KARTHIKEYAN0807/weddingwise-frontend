// src/components/LoadingScreen.jsx
import React from 'react';
import { Spinner } from 'react-bootstrap';
import logo from '../images/wedding_logo.png'; // Import the logo image
import './LoadingScreen.css'; // Custom CSS for styling

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <img src={logo} alt="WeddingWise Logo" className="loading-logo" /> {/* Add the logo */}
      <Spinner animation="border" variant="light" role="status" className="loading-spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <div className="loading-text">WeddingWise</div>
    </div>
  );
};

export default LoadingScreen;