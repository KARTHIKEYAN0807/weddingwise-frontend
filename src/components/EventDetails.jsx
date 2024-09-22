import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const EventDetails = () => {
    const { id } = useParams(); // The event ID from the URL
    const { user, addEventBooking } = useContext(AppContext);
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

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

    const BookingSchema = Yup.object().shape({
        name: Yup.string().required('Your name is required'), // Updated from userName
        email: Yup.string().email('Invalid email').required('Email is required'),
        date: Yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
        guests: Yup.number().min(1, 'At least 1 guest is required').required('Number of guests is required'),
    });

    return (
        <Container className="animate__animated animate__fadeIn mt-5">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" />
                </div>
            ) : event ? (
                <>
                    <Row>
                        <Col md={8} className="mx-auto">
                            <h2>{event.name}</h2>
                            {event.img && (
                                <img src={event.img} alt={event.name} className="img-fluid mb-4" />
                            )}
                            <p>{event.description}</p>
                            <h4>Book This Event</h4>
                            {showSuccess && (
                                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                                    Event booked successfully! Redirecting to your account...
                                </Alert>
                            )}
                            {errorMessage && (
                                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                                    {errorMessage}
                                </Alert>
                            )}
                            <Formik
                                initialValues={{
                                    name: user?.name || '',
                                    email: user?.email || '',
                                    date: '',
                                    guests: 1 // Default value for guests
                                }}
                                validationSchema={BookingSchema}
                                onSubmit={async (values, { resetForm }) => {
                                    try {
                                        console.log('Booking values:', values); // Debug log to check values
                                        await addEventBooking({
                                            eventId: event._id, // Ensure event._id is passed
                                            ...values, // Pass name, email, date, guests
                                        });

                                        setShowSuccess(true);
                                        setTimeout(() => {
                                            navigate('/user-account');
                                            resetForm();
                                        }, 2000);
                                    } catch (error) {
                                        console.error('Error booking event:', error.response?.data || error.message);
                                        setErrorMessage('Error booking event. Please try again.');
                                    }
                                }}
                            >
                                {({ handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Your Name</Form.Label>
                                            <Field name="name" type="text" className="form-control" />
                                            <ErrorMessage name="name" component="div" className="text-danger" />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Field name="email" type="email" className="form-control" />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date of Event</Form.Label>
                                            <Field name="date" type="date" className="form-control" />
                                            <ErrorMessage name="date" component="div" className="text-danger" />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Number of Guests</Form.Label>
                                            <Field name="guests" type="number" className="form-control" />
                                            <ErrorMessage name="guests" component="div" className="text-danger" />
                                        </Form.Group>
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
                <Alert variant="danger">Event not found.</Alert>
            )}
        </Container>
    );
};

export default EventDetails;
