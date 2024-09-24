import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    // If the user is not logged in, show the login prompt
    if (!user) {
        return (
            <Container className="mt-5 text-center">
                <h3>Please log in to access this page.</h3>
                <Button variant="primary" onClick={() => navigate('/login')} className="mt-3">Login</Button>
            </Container>
        );
    }

    // If the user is logged in, render the children components
    return children;
};

export default ProtectedRoute;