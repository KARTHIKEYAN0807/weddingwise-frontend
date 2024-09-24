import React, { useContext, useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const navigate = useNavigate();
  const { user, addToCart } = useContext(AppContext); // Access addToCart from context
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://weddingwisebooking.onrender.com/api/events');
        // Ensure that response.data is an array
        if (Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          throw new Error('Events data is not in the expected format');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage('Failed to load events.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookEvent = (event) => {
    if (user) {
      addToCart(event, 'event'); // Add event to cart
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
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row>
          {filteredEvents.map((event) => (
            <Col md={6} lg={4} key={event._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={event.img || '/images/default-event.jpg'} // Fallback image if no img is provided
                  alt={event.name}
                />
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    {event.description || 'No description provided.'}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleBookEvent(event)}
                    disabled={loading} // Disable if loading
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && filteredEvents.length === 0 && (
        <Alert variant="info" className="text-center">
          No events found matching your search.
        </Alert>
      )}
    </Container>
  );
};

export default Events;
