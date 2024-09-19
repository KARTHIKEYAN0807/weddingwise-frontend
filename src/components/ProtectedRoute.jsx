import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext); // Get the user from the context
    const location = useLocation(); // Get the current location

    // Log user and token for debugging purposes
    console.log("ProtectedRoute: Current User:", user);
    console.log("ProtectedRoute: Attempting to access:", location.pathname);

    // Check the token in localStorage
    const token = localStorage.getItem('authToken');
    console.log("Token in LocalStorage:", token);

    // If no user or no token, redirect to the login page
    if (!user || !token) {
        console.log("User is not authenticated, redirecting to login");
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // If the user is authenticated, render the children components
    return children;
};

export default ProtectedRoute;
