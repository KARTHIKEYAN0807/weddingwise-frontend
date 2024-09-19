import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);
    const location = useLocation();

    // Log the user and token for debugging
    console.log("ProtectedRoute: Current User:", user);
    console.log("ProtectedRoute: Attempting to access:", location.pathname);
    
    // Check the token in localStorage
    const token = localStorage.getItem('authToken');
    console.log("Token in LocalStorage:", token);

    // If the user is not logged in, redirect to the login page
    if (!user || !token) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // If the user is logged in, render the children components
    return children;
};

export default ProtectedRoute;
