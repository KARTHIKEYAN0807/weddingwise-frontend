import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const VendorDetails = () => {
    const { id } = useParams(); // Get vendor ID from URL params
    const { user, addToCart } = useContext(AppContext); // Access addToCart from AppContext
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState(null);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await axios.get(`https://weddingwisebooking.onrender.com/api/vendors/${id}`);
                if (response.data && response.data.data) {
                    setVendor(response.data.data);
                } else {
                    setErrorMessage('Vendor data format is incorrect');
                }
            } catch (error) {
                console.error('Error fetching vendor:', error);
                setErrorMessage('Vendor not found.');
            }
            setLoading(false);
        };

        fetchVendor();
    }, [id]);

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

    return (
        <Container className="animate__animated animate__fadeIn mt-5">
            {loading ? (
                <div className="loading-container">
                    <div className="loading-text">Loading...</div>
                </div>
            ) : (
                vendor ? (
                    <Row>
                        <Col md={8} className="mx-auto">
                            <h2>{vendor.name}</h2>
                            {vendor.img && (
                                <img src={vendor.img} alt={vendor.name} className="img-fluid mb-4" />
                            )}
                            <p>{vendor.description}</p>
                            <h4>Add to Cart</h4>
                            {showSuccess && (
                                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                                    Vendor added to cart! Redirecting to your account...
                                </Alert>
                            )}
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
                                        // Add the vendor booking to the cart using addToCart from AppContext
                                        addToCart({
                                            vendorId: id,
                                            vendorName: vendor.name,
                                            userName: values.userName,
                                            email: values.email,
                                            date: values.date,
                                            guests: values.guests
                                        });

                                        setShowSuccess(true);
                                        resetForm();
                                        setTimeout(() => {
                                            navigate('/user-account'); // Redirect to user account to review cart
                                        }, 2000);
                                    } catch (error) {
                                        console.error('Error adding vendor to cart:', error);
                                        setErrorMessage('Error adding vendor to cart. Please try again.');
                                    }
                                }}
                            >
                                {({ handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Vendor Name</label>
                                            <Field name="vendorName" type="text" className="form-control" disabled value={vendor.name} />
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
                    <Alert variant="danger">Vendor not found.</Alert>
                )
            )}
        </Container>
    );
};

export default VendorDetails;
