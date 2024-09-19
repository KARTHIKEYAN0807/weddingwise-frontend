// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const { user, logoutUser, darkMode, toggleDarkMode } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <Navbar 
      bg={darkMode ? 'dark' : 'light'} 
      variant={darkMode ? 'dark' : 'light'} 
      expand="lg" 
      className="animate__animated animate__fadeInDown"
    >
      <Container>
        <Navbar.Brand href="/" className="me-auto">
          <img
            src="/images/wedding_logo.png" // Logo image path
            alt="WeddingWise Logo"
            width="40"
            height="40"
            className="d-inline-block align-top"
          />
          {' '}WeddingWise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="/vendors">Vendors</Nav.Link>
            <Nav.Link href="/budget">Budget</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            {user ? (
              <>
                <Nav.Link href="/user-account">User Account</Nav.Link>
                <Nav.Link href="/user-profile">Profile</Nav.Link>
                <Button 
                  variant="outline-secondary" 
                  onClick={handleLogout} 
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            )}
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              label="Dark Mode"
              className="ms-3"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
