import React, { useContext, useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]); // Ensure events is initialized as an empty array
  const [loading, setLoading] = useState(true); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://weddingwisebooking.onrender.com/api/events');
        console.log('Fetched events:', response.data); // Log to see what data is received

        // Check if the response has the correct structure and data
        if (response.data && response.data.status === 'success') {
          setEvents(response.data.data); // Access the "data" array
        } else {
          console.error('Unexpected data format:', response.data);
          setErrorMessage('Invalid data format received from the server.');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage(error.response?.data?.msg || 'Failed to load events.');
      } finally {
        setLoading(false); 
      }
    };

    fetchEvents();
  }, []);

  // Ensure events is an array before filtering
  const filteredEvents = Array.isArray(events) 
    ? events.filter((event) => (event.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleBookEvent = (event) => {
    if (user) {
      console.log('Event ID being sent:', event._id); // Debugging log
      navigate(`/events/${event._id}`);
    } else {
      alert('Please log in or register to book an event.');
      navigate('/login');
    }
  };

  return (
    <Container className="animate__animated animate__fadeIn">
      <h2 className="text-center my-4">Events</h2>
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search for events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <Alert variant="info" className="text-center">
          No events found.
        </Alert>
      ) : (
        <Row>
          {filteredEvents.map((event) => (
            <Col md={6} lg={4} key={event._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={event.img || '/images/default-event.jpg'}
                  alt={event.name}
                />
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>{event.description || 'No description provided.'}</Card.Text>
                  <Button variant="primary" onClick={() => handleBookEvent(event)}>
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Events;
