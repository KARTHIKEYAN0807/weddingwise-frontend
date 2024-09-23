import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const EventDetails = () => {
    const { id } = useParams(); // Event ID from the URL
    const { user, addEventBooking } = useContext(AppContext); // Get the user and booking function from context
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null); // Initialize event state

    // Fetch event details
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`https://weddingwisebooking.onrender.com/api/events/${id}`);
                setEvent(response.data.data); // Ensure response.data.data contains the event details
            } catch (error) {
                console.error('Error fetching event:', error);
                setErrorMessage('Event not found.');
            }
            setLoading(false);
        };

        fetchEvent();
    }, [id]);

    // Validation schema using Yup
    const BookingSchema = Yup.object().shape({
        name: Yup.string().required('Your name is required'), // Validate name field
        email: Yup.string().email('Invalid email').required('Email is required'), // Validate email field
        date: Yup.date().required('Date is required').min(new Date(), 'Date must be in the future'), // Ensure date is in the future
        guests: Yup.number().min(1, 'At least 1 guest is required').required('Number of guests is required'), // Validate guests count
    });

    // Ensure event ID is passed properly for booking
    const handleBooking = async (values, resetForm) => {
        try {
            if (!event || !event._id) {
                setErrorMessage("Event ID is missing.");
                return;
            }

            await addEventBooking({
                eventId: event._id, // Ensure event._id is passed here for the backend booking request
                ...values, // Pass name, email, date, guests
            });

            setShowSuccess(true); // Show success message
            setTimeout(() => {
                navigate('/user-account'); // Redirect to user account page
                resetForm(); // Reset form after successful booking
            }, 2000);
        } catch (error) {
            console.error('Error booking event:', error.response?.data || error.message);
            setErrorMessage('Error booking event. Please try again.'); // Display error if booking fails
        }
    };

    return (
        <Container className="animate__animated animate__fadeIn mt-5">
            {loading ? (
                // Show loading spinner while fetching event details
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" />
                </div>
            ) : event ? (
                <>
                    <Row>
                        <Col md={8} className="mx-auto">
                            <h2>{event.name}</h2> {/* Display the event name */}
                            {event.img && (
                                <img src={event.img} alt={event.name} className="img-fluid mb-4" /> // Display event image if available
                            )}
                            <p>{event.description}</p> {/* Display event description */}
                            <h4>Book This Event</h4>

                            {/* Success message */}
                            {showSuccess && (
                                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                                    Event booked successfully! Redirecting to your account...
                                </Alert>
                            )}

                            {/* Error message */}
                            {errorMessage && (
                                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                                    {errorMessage}
                                </Alert>
                            )}

                            {/* Formik form to handle event booking */}
                            <Formik
                                initialValues={{
                                    name: user?.name || '', // Pre-fill name if user is logged in
                                    email: user?.email || '', // Pre-fill email if user is logged in
                                    date: '',
                                    guests: 1 // Default number of guests
                                }}
                                validationSchema={BookingSchema}
                                onSubmit={(values, { resetForm }) => handleBooking(values, resetForm)} // Call handleBooking on form submit
                            >
                                {({ handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        {/* Event Name (Disabled) */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Event Name</Form.Label>
                                            <Field
                                                name="eventName"
                                                type="text"
                                                className="form-control"
                                                value={event?.name || ''} // Pre-fill the event name from the event data
                                                disabled
                                            />
                                            <ErrorMessage name="eventName" component="div" className="text-danger" />
                                        </Form.Group>

                                        {/* User's Name */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Your Name</Form.Label>
                                            <Field name="name" type="text" className="form-control" /> {/* Name field */}
                                            <ErrorMessage name="name" component="div" className="text-danger" />
                                        </Form.Group>

                                        {/* User's Email */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Field name="email" type="email" className="form-control" /> {/* Email field */}
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </Form.Group>

                                        {/* Date of Event */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date of Event</Form.Label>
                                            <Field name="date" type="date" className="form-control" /> {/* Date field */}
                                            <ErrorMessage name="date" component="div" className="text-danger" />
                                        </Form.Group>

                                        {/* Number of Guests */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Number of Guests</Form.Label>
                                            <Field name="guests" type="number" className="form-control" /> {/* Guests field */}
                                            <ErrorMessage name="guests" component="div" className="text-danger" />
                                        </Form.Group>

                                        {/* Submit Button */}
                                        <Button variant="primary" type="submit" className="w-100">
                                            Book Now
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Col>
                    </Row>
                </>
            ) : (
                <Alert variant="danger">Event not found.</Alert> // Show error if event is not found
            )}
        </Container>
    );
};

export default EventDetails;
