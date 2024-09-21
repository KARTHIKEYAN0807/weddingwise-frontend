import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const VendorDetails = () => {
    const { id } = useParams();
    const { user, addVendorBooking } = useContext(AppContext);
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState(null);

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

    // Updated Yup validation schema
    const BookingSchema = Yup.object().shape({
        vendorName: Yup.string().required('Vendor name is required'),
        userName: Yup.string().required('Your name is required'),
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
                vendor ? (
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
                                    initialValues={{
                                        vendorName: vendor.name || 'Untitled Vendor',
                                        userName: user?.name || '', // Auto-fill user's name
                                        email: user?.email || '', // Auto-fill user's email
                                        date: '',
                                        guests: ''
                                    }}
                                    validationSchema={BookingSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        try {
                                            // Add vendor booking to local state
                                            addVendorBooking({
                                                vendorName: vendor.name,
                                                ...values,
                                            });

                                            setShowSuccess(true);
                                            
                                            // Redirect to user account page after a short delay
                                            setTimeout(() => {
                                                navigate('/user-account');
                                            }, 2000);
                                            resetForm();
                                        } catch (error) {
                                            console.error('Error booking vendor:', error);
                                            setErrorMessage('Error booking vendor. Please try again.');
                                        }
                                    }}
                                >
                                    {({ handleSubmit }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>Vendor Name</label>
                                                <Field name="vendorName" type="text" className="form-control" disabled />
                                                <ErrorMessage name="vendorName" component="div" className="text-danger" />
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
                                                Book Now
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <Alert variant="danger">Vendor not found.</Alert>
                )
            )}
        </Container>
    );
};

export default VendorDetails;
