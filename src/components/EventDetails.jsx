import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const EventDetails = () => {
    const { id } = useParams(); // id from the URL (eventId)
    const { user, addToCart } = useContext(AppContext); // Use addToCart from context
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

    // Fetch event details based on the event ID
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                console.log('Fetching event with ID:', id); // Log event ID for debugging
                const response = await axios.get(`https://weddingwisebooking.onrender.com/api/events/${id}`);
                if (response.data && response.data.data) {
                    setEvent(response.data.data);
                } else {
                    setErrorMessage('Event data format is incorrect');
                }
            } catch (error) {
                console.error('Error fetching event:', error);
                setErrorMessage('Event not found.');
            }
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    // Define validation schema using Yup
    const BookingSchema = Yup.object().shape({
        userName: Yup.string().required('Your name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        date: Yup.date()
            .required('Date is required')
            .min(new Date(), 'Date must be in the future'),
        guests: Yup.number()
            .min(1, 'At least 1 guest is required')
            .required('Number of guests is required'),
    });

    // Handle form submission to add event to cart
    return (
        <Container className="animate__animated animate__fadeIn mt-5">
            {loading ? (
                <div className="loading-container text-center">
                    <Spinner animation="border" variant="primary" />
                    <div className="loading-text mt-2">Loading...</div>
                </div>
            ) : (
                event ? (
                    <Row>
                        <Col md={8} className="mx-auto">
                            <h2>{event.name}</h2>
                            {event.img && (
                                <img src={event.img} alt={event.name} className="img-fluid mb-4" />
                            )}
                            <p>{event.description}</p>
                            <h4>Add to Cart</h4>
                            {errorMessage && (
                                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                                    {errorMessage}
                                </Alert>
                            )}
                            <Formik
                                initialValues={{
                                    userName: user?.name || '',
                                    email: user?.email || '',
                                    date: '',
                                    guests: ''
                                }}
                                validationSchema={BookingSchema}
                                onSubmit={(values, { resetForm }) => {
                                    try {
                                        // Add event booking to the cart
                                        addToCart({
                                            eventId: id,
                                            eventName: event.name,
                                            userName: values.userName,
                                            email: values.email,
                                            date: values.date,
                                            guests: values.guests
                                        });

                                        resetForm();
                                        navigate('/user-account'); // Redirect to user account to view cart
                                    } catch (error) {
                                        console.error('Error adding to cart:', error);
                                        setErrorMessage('Error adding event to cart. Please try again.');
                                    }
                                }}
                            >
                                {({ handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Event Name</label>
                                            <Field name="eventName" type="text" className="form-control" disabled value={event.name} />
                                        </div>
                                        <div className="form-group">
                                            <label>Your Name</label>
                                            <Field name="userName" type="text" className="form-control" />
                                            <ErrorMessage name="userName" component="div" className="text-danger" />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <Field name="email" type="email" className="form-control" />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </div>
                                        <div className="form-group">
                                            <label>Date of Event</label>
                                            <Field name="date" type="date" className="form-control" />
                                            <ErrorMessage name="date" component="div" className="text-danger" />
                                        </div>
                                        <div className="form-group">
                                            <label>Number of Guests</label>
                                            <Field name="guests" type="number" className="form-control" />
                                            <ErrorMessage name="guests" component="div" className="text-danger" />
                                        </div>
                                        <Button variant="primary" type="submit" className="w-100">
                                            Add to Cart
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Col>
                    </Row>
                ) : (
                    <Alert variant="danger">Event not found.</Alert>
                )
            )}
        </Container>
    );
};

export default EventDetails;
