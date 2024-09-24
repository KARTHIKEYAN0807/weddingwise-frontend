import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

const RequestResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Directly set the API Base URL here
  const API_BASE_URL = 'https://weddingwisebooking.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/send-reset-password-email`, { email });
      setMessage(response.data.msg);
      setError('');
      setEmail(''); // Clear the email input after successful submission
    } catch (error) {
      console.error('Error sending reset password email:', error);
      setError(error.response?.data?.msg || 'Failed to send reset password email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="animate__animated animate__fadeInUp mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Request Password Reset</h2>
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

export default RequestResetPassword;