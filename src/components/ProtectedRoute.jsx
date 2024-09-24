import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

// This component will protect routes from being accessed without a logged-in user
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);

    // If the user is not logged in, redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If the user is logged in, render the children components (protected routes)
    return children;
};

export default ProtectedRoute;
