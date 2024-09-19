// src/components/ProtectedRoute.jsx
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);
    const location = useLocation();

    // Debugging log to check current user status and the requested route
    console.log("ProtectedRoute: Current User:", user);
    console.log("ProtectedRoute: Attempting to access:", location.pathname);

    // If the user is not logged in, redirect to the login page
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // If the user is logged in, render the children components
    return children;
};

export default ProtectedRoute;
