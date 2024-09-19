import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Optional: Use this to decode JWT tokens if needed

const ProtectedRoute = ({ children }) => {
    const { user, setUser } = useContext(AppContext); // Get user and setter from context
    const location = useLocation(); // Get the current route location
    const [isValidToken, setIsValidToken] = useState(false); // State to track token validity

    useEffect(() => {
        // Check the token in localStorage
        const token = localStorage.getItem('authToken');
        console.log("Token in LocalStorage:", token);

        // If no token, don't allow access
        if (!token) {
            console.log("No token found, redirecting to login");
            setIsValidToken(false);
            return;
        }

        try {
            // Optional: Decode the JWT to check for expiration or additional validation
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);

            // Validate token expiration (example)
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                console.log("Token expired, redirecting to login");
                setIsValidToken(false);
                return;
            }

            // If user is not already in context, set the user based on the token
            if (!user) {
                setUser(decodedToken.user); // Assuming token contains user info
            }

            // If everything is fine, mark the token as valid
            setIsValidToken(true);
        } catch (error) {
            console.log("Error decoding token:", error);
            setIsValidToken(false);
        }
    }, [user, setUser]);

    // If no valid token, redirect to the login page
    if (!isValidToken) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // If the token and user are valid, render the protected route's children components
    return children;
};

export default ProtectedRoute;
