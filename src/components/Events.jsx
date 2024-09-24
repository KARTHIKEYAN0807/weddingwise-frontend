import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Events = () => {
  const navigate = useNavigate();
  const { addToCart, user } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://weddingwisebooking.onrender.com/api/events');
        setEvents(response.data.data);
      } catch (error) {
        setErrorMessage('Failed to load events.');
      } finally {
        setLoading(false); 
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const handleBookEvent = (event) => {
    if (user) {
      addToCart(event, 'event');
    } else {
      alert('Please log in to book an event.');
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
                  src={event.img ? event.img : '/images/default-event.jpg'}
                  alt={event.name}
                />
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Button variant="primary" onClick={() => handleBookEvent(event)}>
                    Book
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
