// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = 'https://weddingwisebooking.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Submitting email:', email); // Debugging line
    console.log('API Base URL:', API_BASE_URL); // Debugging line

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/send-reset-password-email`, { email });
      console.log('Response:', response.data); // Debugging line
      setMessage(response.data.msg || 'If an account with that email exists, a reset link has been sent.');
      setError('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error sending reset password email:', err);

      // Handle various error cases
      if (err.response && err.response.data) {
        setError(err.response.data.msg || 'Failed to send reset password email. Please try again.');
      } else {
        setError('Failed to send reset password email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="animate__animated animate__fadeInUp mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Forgot Password</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
