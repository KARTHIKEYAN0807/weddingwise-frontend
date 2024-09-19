import React, { useContext, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const UserProfile = () => {
    const { user, loginUser } = useContext(AppContext);
    const [formData, setFormData] = useState({ name: user?.name, email: user?.email });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make an API call to update the user profile
            const response = await axios.put('https://weddingwisebooking.onrender.com/api/users/update-profile', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token in the request
                },
            });
            const { token, userData } = response.data; // Get the token and user data from the response

            setSuccessMessage('Profile updated successfully!');
            setErrorMessage('');
            loginUser(userData, token); // Update the user context with the updated data and new token
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
        }
    };

    return (
        <Container className="mt-5">
            <h2>User Profile</h2>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Update Profile
                </Button>
            </Form>
        </Container>
    );
};

export default UserProfile;
