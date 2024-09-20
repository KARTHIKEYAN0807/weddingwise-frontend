import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const EventDetails = () => {
    const { id } = useParams();
    const { addEventBooking } = useContext(AppContext);
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`https://weddingwisebooking.onrender.com/api/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error('Error fetching event:', error);
                setErrorMessage('Event not found.');
            }
            setLoading(false);
        };

        fetchEvent();
    }, [id]);

    const BookingSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        date: Yup.date().required('Date is required'),
        guests: Yup.number().min(1, 'At least 1 guest is required').required('Number of guests is required'),
    });

    return (
        <Container className="animate__animated animate__fadeIn mt-5">
            {loading ? (
                <div className="loading-container">
                    <div className="loading-text">Loading...</div>
                </div>
            ) : (
                event ? (
                    <>
                        <Row>
                            <Col md={8} className="mx-auto">
                                <h2>{event.title}</h2>
                                {event.img && (
                                    <img src={event.img} alt={event.title} className="img-fluid mb-4" />
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
                                    initialValues={{ name: '', email: '', date: '', guests: '' }}
                                    validationSchema={BookingSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        try {
                                            // Add event booking to local state
                                            addEventBooking({
                                                title: event.title,  // Ensure we're using 'title' here
                                                ...values,
                                            });

                                            setShowSuccess(true);

                                            // Redirect to user account page after a short delay
                                            setTimeout(() => {
                                                navigate('/user-account');
                                            }, 2000);
                                            resetForm();
                                        } catch (error) {
                                            console.error('Error booking event:', error);
                                            setErrorMessage('Error booking event. Please try again.');
                                        }
                                    }}
                                >
                                    {({ handleSubmit }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>Name</label>
                                                <Field name="name" type="text" className="form-control" />
                                                <ErrorMessage name="name" component="div" className="text-danger" />
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
                                                Book Now
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <Alert variant="danger">
                        Event not found.
                    </Alert>
                )
            )}
        </Container>
    );
};

export default EventDetails;
