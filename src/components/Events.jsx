import React, { useContext, useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://weddingwisebooking.onrender.com/api/events'); // Update this URL with your events API endpoint
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage('Failed to load events.');
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on the search term
  const filteredEvents = events.filter(event =>
    (event.name || '').toLowerCase().includes(searchTerm.toLowerCase()) // Use event.name instead of title or eventTitle
  );

  const handleBookEvent = (event) => {
    if (user) {
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
      <Row>
        {filteredEvents.map((event) => (
          <Col md={6} lg={4} key={event._id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={event.img || '/images/default-event.jpg'} // Fallback image if no img is provided
                alt={event.name} // Updated to use event.name
              />
              <Card.Body>
                <Card.Title>{event.name}</Card.Title> {/* Updated to use event.name */}
                <Card.Text>{event.description || 'No description provided.'}</Card.Text>
                <Button variant="primary" onClick={() => handleBookEvent(event)}>
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;
