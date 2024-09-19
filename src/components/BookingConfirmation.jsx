import React from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import 'animate.css';

const BookingConfirmation = () => (
  <Container className="animate__animated animate__fadeIn mt-5 text-center" style={{ minHeight: '80vh' }}>
    <Row>
      <Col md={8} className="mx-auto">
        <Alert variant="success" className="animate__animated animate__zoomIn animate__delay-1s">
          <h2 className="animate__animated animate__bounceInDown">Booking Confirmed!</h2>
          <p className="animate__animated animate__fadeInUp animate__delay-2s">
            Your booking has been successfully confirmed. Our team will contact you shortly to discuss further details.
          </p>
          <Button href="/" variant="primary" className="mt-3 animate__animated animate__fadeInUp animate__delay-3s">
            Go to Home
          </Button>
        </Alert>
        <div className="animate__animated animate__pulse animate__infinite mt-3">
          <p>Thank you for choosing us!</p>
        </div>
      </Col>
    </Row>
  </Container>
);

export default BookingConfirmation;
