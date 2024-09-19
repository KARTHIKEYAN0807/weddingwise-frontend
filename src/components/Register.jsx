import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Validation schema using Yup
const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
        .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const Register = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = React.useState(''); // To store server error
    const [successMessage, setSuccessMessage] = React.useState(''); // To store success message

    return (
        <Container className="animate__animated animate__fadeInUp mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h1 className="text-center mb-4">WeddingWise</h1>
                    <img 
                        src="/images/register_showcase.jpg" 
                        alt="Wedding Showcase" 
                        className="img-fluid mb-4 rounded" 
                        style={{ maxHeight: '200px', objectFit: 'cover' }} 
                    />
                    <h2 className="text-center">Register</h2>

                    <Formik
                        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                        validationSchema={RegisterSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            setServerError(''); // Reset server error
                            setSuccessMessage(''); // Reset success message
                            try {
                                console.log('Registering with values:', values);

                                const response = await axios.post('https://weddingwisebooking.onrender.com/api/users/register', {
                                    name: values.name,
                                    email: values.email,
                                    password: values.password,
                                });

                                console.log('Server response:', response);

                                if (response.status === 201) {
                                    // Show success message and redirect to login page
                                    setSuccessMessage('Registration successful! Redirecting to login...');
                                    resetForm(); // Clear the form fields
                                    setTimeout(() => {
                                        navigate('/login');
                                    }, 2000);
                                }
                            } catch (error) {
                                console.error('Registration error:', error);
                                if (error.response) {
                                    // Handle server error response
                                    const errorData = error.response.data;
                                    console.log('Error response:', errorData);
                                    
                                    // Display specific server error message if available
                                    setServerError(errorData.msg || 'An error occurred during registration');
                                } else {
                                    // Fallback error message
                                    setServerError('An unexpected error occurred. Please try again.');
                                }
                            }
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {serverError && (
                                    <Alert 
                                        variant="danger" 
                                        onClose={() => setServerError('')} 
                                        dismissible
                                    >
                                        {serverError}
                                    </Alert>
                                )}
                                {successMessage && (
                                    <Alert 
                                        variant="success" 
                                        onClose={() => setSuccessMessage('')} 
                                        dismissible
                                    >
                                        {successMessage}
                                    </Alert>
                                )}
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <Field name="name" type="text" className="form-control" />
                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Field name="email" type="email" className="form-control" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Field name="password" type="password" className="form-control" />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <Field name="confirmPassword" type="password" className="form-control" />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                </div>
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Register'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
