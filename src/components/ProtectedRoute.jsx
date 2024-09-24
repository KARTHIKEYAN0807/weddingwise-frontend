import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Container, Button } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AppContext);

    // If the user is not logged in, show a message with a login button
    if (!user) {
        return (
            <Container className="mt-5 text-center">
                <h3>You need to log in to access this page.</h3>
                <Button variant="primary" onClick={() => window.location.href = '/login'} className="mt-3">Go to Login</Button>
            </Container>
        );
    }

    // If the user is logged in, render the children components
    return children;
};

export default ProtectedRoute;
