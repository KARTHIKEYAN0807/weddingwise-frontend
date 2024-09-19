import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, setUser } = useContext(AppContext); // Get user and setter from context
    const location = useLocation(); // Get the current route location
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status

    useEffect(() => {
        // Check if the token exists in localStorage
        const token = localStorage.getItem('authToken');
        console.log("Token in LocalStorage:", token);

        if (token) {
            // Token exists, meaning the user is authenticated
            setIsAuthenticated(true);
        } else {
            // No token found, user is not authenticated
            setIsAuthenticated(false);
        }
    }, [user]);

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // If the user is authenticated, render the protected content (children)
    return children;
};

export default ProtectedRoute;
