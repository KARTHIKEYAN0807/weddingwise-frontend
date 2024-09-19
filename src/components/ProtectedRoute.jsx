// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);

    // If the user is not logged in, redirect to the register page
    if (!user) {
        return <Navigate to="/register" />;
    }

    // If the user is logged in, render the children components
    return children;
};

export default ProtectedRoute;
