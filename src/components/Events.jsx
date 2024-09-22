import React, { useContext, useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://weddingwisebooking.onrender.com/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage(
          error.response?.data?.msg || 'Something went wrong. Please try again later.'
        );
      } finally {
        setLoading(false); // Stop loading after fetching or error
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on the search term
  const filteredEvents = events.filter((event) =>
    (event.name || '').toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Display loading spinner while fetching events */}
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <Alert variant="info" className="text-center">
          {searchTerm ? 'No events match your search criteria.' : 'No events available.'}
        </Alert>
      ) : (
        <Row>
          {filteredEvents.map((event) => (
            <Col md={6} lg={4} key={event._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={event.img || '/images/default-event.jpg'} // Ensure this image exists
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
