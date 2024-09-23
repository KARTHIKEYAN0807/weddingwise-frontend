import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext'; // Import your AppContext
import { Navigate, useLocation } from 'react-router-dom';

// Helper function to validate token expiration
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token payload
    return decoded.exp > Date.now() / 1000; // Check if the token has expired
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AppContext); // Get user and loading state from AppContext
    const location = useLocation(); // Get the current location

    // Log user and token for debugging purposes
    console.log("ProtectedRoute: Current User:", user);
    console.log("ProtectedRoute: Attempting to access:", location.pathname);

    // Check the token in localStorage
    const token = localStorage.getItem('authToken');
    console.log("Token in LocalStorage:", token);

    // If the app is still loading user information, show a loading indicator
    if (loading) {
        return <div>Loading...</div>; // You can replace this with a spinner or loading animation
    }

    // If no user or no valid token, redirect to the login page
    if (!user || !token || !isTokenValid(token)) {
        console.log("User is not authenticated or token is invalid, redirecting to login");
        return <Navigate to="/login" state={{ from: location }} />; // Preserve the original route
    }

    // If the user is authenticated, render the children components (the protected content)
    return children;
};

export default ProtectedRoute;
