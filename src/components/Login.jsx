import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// Validation schema for login form
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Login = () => {
    const { loginUser } = useContext(AppContext); // Access loginUser from context
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(''); // State to handle login errors
    const [loginSuccess, setLoginSuccess] = useState(''); // State to handle login success messages

    return (
        <Container className="animate__animated animate__fadeInUp mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h1 className="text-center mb-4">WeddingWise</h1>
                    <img 
                        src="/images/login_showcase.jpg" 
                        alt="Wedding Showcase" 
                        className="img-fluid mb-4 rounded" 
                        style={{ maxHeight: '200px', objectFit: 'cover' }} 
                    />
                    <h2 className="text-center">Login</h2>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            setLoginError(''); // Reset error state
                            setLoginSuccess(''); // Reset success message state
                            try {
                                // Trim the email and password to avoid unwanted spaces
                                const trimmedValues = {
                                    email: values.email.trim(),
                                    password: values.password.trim(),
                                };

                                const response = await axios.post('https://weddingwisebooking.onrender.com/api/users/login', trimmedValues, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                const { token, userData } = response.data;

                                if (token) {
                                    loginUser(userData, token); // Save the user data and token in context
                                    setLoginSuccess('Login successful! Redirecting...');
                                    resetForm(); // Clear the form after successful login
                                    setTimeout(() => {
                                        navigate('/user-account'); // Redirect to user account page
                                    }, 2000);
                                } else {
                                    console.error('Token is missing in the response');
                                    setLoginError('Login failed. Please try again.');
                                }
                            } catch (error) {
                                console.error('Login Error:', error);
                                if (error.response && error.response.data) {
                                    setLoginError(error.response.data.msg || 'Invalid email or password');
                                } else {
                                    setLoginError('Login failed. Please try again.');
                                }
                            }
                            setSubmitting(false); // Set submitting to false after the operation completes
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {loginError && <Alert variant="danger">{loginError}</Alert>}
                                {loginSuccess && <Alert variant="success">{loginSuccess}</Alert>}

                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <Field name="email" type="email" className="form-control" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="password">Password</label>
                                    <Field name="password" type="password" className="form-control" />
                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                </div>

                                <Button variant="primary" type="submit" className="w-100 mt-4" disabled={isSubmitting}>
                                    {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}
                                </Button>

                                <div className="text-center mt-3">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
