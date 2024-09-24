// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => (
  <footer className="bg-dark text-white py-4 mt-auto">
    <Container>
      <Row>
        <Col md={6}>
          <img
            src="/images/wedding_logo.png" // Logo image path
            alt="WeddingWise Logo"
            width="40"
            height="40"
            className="d-inline-block align-top mb-2"
          />
          <h5>WeddingWise</h5>
          <p>Your one-stop solution for all your wedding needs.</p>
        </Col>
        <Col md={3}>
          <h5>Quick Links</h5>
          <ul className="list-unstyled">
            <li><a href="/events" className="text-white">Events</a></li>
            <li><a href="/vendors" className="text-white">Vendors</a></li>
            <li><a href="/contact" className="text-white">Contact</a></li>
            <li><a href="/login" className="text-white">Login</a></li>
          </ul>
        </Col>
        <Col md={3}>
          <h5>Contact Us</h5>
          <p>Email: info@weddingwise.com</p>
          <p>Phone: +123 456 7890</p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="text-center">
          <p>&copy; {new Date().getFullYear()} WeddingWise. All Rights Reserved.</p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;