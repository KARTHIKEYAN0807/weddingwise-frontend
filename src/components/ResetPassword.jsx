import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Set the API Base URL
  const API_BASE_URL = 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPassword = e.target.elements.newPassword.value;
    const confirmPassword = e.target.elements.confirmPassword.value;

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Additional password validation (e.g., length and complexity)
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Reset password request:', { token, newPassword }); // Log request data

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/reset-password`, {
        token,
        newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check response status
      if (response.status === 200) {
        setSuccess('Your password has been reset successfully.');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.msg || 'An error occurred while resetting the password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="animate__animated animate__fadeInUp mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Reset Password</h2>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control name="newPassword" type="password" placeholder="Enter new password" required />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control name="confirmPassword" type="password" placeholder="Confirm new password" required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
