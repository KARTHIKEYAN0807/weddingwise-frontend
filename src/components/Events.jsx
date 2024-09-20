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
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://weddingwisebooking.onrender.com/api/events');
        setEvents(response.data);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage('Failed to load events.');
        setLoading(false); // Stop loading even if there’s an error
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on the search term
  const filteredEvents = events.filter(event =>
    (event.title || event.eventTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

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
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Col md={6} lg={4} key={event._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={event.img || '/images/default-event.jpg'} // Fallback image if no img is provided
                  alt={event.title || event.eventTitle}
                />
                <Card.Body>
                  <Card.Title>{event.title || event.eventTitle}</Card.Title>
                  <Card.Text>{event.description || 'No description provided.'}</Card.Text>
                  <Button variant="primary" onClick={() => navigate(`/events/${event._id}`)}>
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info" className="text-center">
              No events found.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Events;
