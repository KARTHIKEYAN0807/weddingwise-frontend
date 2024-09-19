import React, { useContext, useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Vendors = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendors, setVendors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch vendors from the backend
    const fetchVendors = async () => {
      try {
        const response = await axios.get('https://weddingwisebooking.onrender.com/api/vendors'); // Update this URL with your vendors API endpoint
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setErrorMessage('Failed to load vendors.');
      }
    };

    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookVendor = (vendor) => {
    if (user) {
      navigate(`/vendors/${vendor._id}`);
    } else {
      alert('Please log in or register to book a vendor.');
      navigate('/login');
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn">
      <h2 className="text-center my-4">Vendors</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search for vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <Row>
        {filteredVendors.map((vendor) => (
          <Col md={6} lg={4} key={vendor._id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={vendor.img} alt={vendor.name} />
              <Card.Body>
                <Card.Title>{vendor.name}</Card.Title>
                <Card.Text>{vendor.description}</Card.Text>
                <Button variant="primary" onClick={() => handleBookVendor(vendor)}>Book Now</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Vendors;
