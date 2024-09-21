import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const VendorDetails = () => {
    const { id } = useParams();
    const { addVendorBooking } = useContext(AppContext);
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState(null);
    const [submitting, setSubmitting] = useState(false); // Track form submission state

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await axios.get(`https://weddingwisebooking.onrender.com/api/vendors/${id}`);
                setVendor(response.data);
            } catch (error) {
                console.error('Error fetching vendor:', error);
                setErrorMessage('Vendor not found.');
            }
            setLoading(false);
        };

        fetchVendor();
    }, [id]);

    const BookingSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        date: Yup.date().required('Date is required'),
        guests: Yup.number().min(1, 'At least 1 guest is required').required('Number of guests is required'),
    });

    const handleSubmitBooking = async (values, resetForm) => {
        setSubmitting(true);
        try {
            // Add vendor booking to local state
            await addVendorBooking({
                vendorName: vendor.name,
                ...values,
            });

            setShowSuccess(true);
            setTimeout(() => {
                navigate('/user-account');
            }, 2000);
            resetForm();
        } catch (error) {
            console.error('Error booking vendor:', error);
            setErrorMessage('Error booking vendor. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="animate__animated animate__fadeIn mt-5">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            ) : vendor ? (
                <>
                    <Row>
                        <Col md={8} className="mx-auto">
                            <h2>{vendor.name}</h2>
                            {vendor.img && (
                                <img src={vendor.img} alt={vendor.name} className="img-fluid mb-4" />
                            )}
                            <p>{vendor.description}</p>
                            <h4>Book This Vendor</h4>
                            {showSuccess && (
                                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                                    Vendor booked successfully! Redirecting to your account...
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
                                onSubmit={(values, { resetForm }) => handleSubmitBooking(values, resetForm)}
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
                                        <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                                            {submitting ? 'Booking...' : 'Book Now'}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Col>
                    </Row>
                </>
            ) : (
                <Alert variant="danger">Vendor not found.</Alert>
            )}
        </Container>
    );
};

export default VendorDetails;
