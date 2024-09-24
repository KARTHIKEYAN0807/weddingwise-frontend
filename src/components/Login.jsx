import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Login = () => {
    const { loginUser } = useContext(AppContext);
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    return (
        <Container className="animate__animated animate__fadeInUp mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h1 className="text-center mb-4">WeddingWise</h1>
                    <img src="/images/login_showcase.jpg" alt="Wedding Showcase" className="img-fluid mb-4" />
                    <h2 className="text-center">Login</h2>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            setLoginError(''); // Clear previous errors
                            try {
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
                                    loginUser(userData, token); // Only pass token
                                    navigate('/user-account');
                                    resetForm(); // Clear form fields after successful login
                                } else {
                                    setLoginError('Login failed. Please try again.');
                                }
                            } catch (error) {
                                if (error.response && error.response.data) {
                                    setLoginError(error.response.data.msg || 'Invalid email or password');
                                } else {
                                    setLoginError('Login failed. Please try again.');
                                }
                            }
                            setSubmitting(false);
                        }}
                    >
                        {({ handleSubmit, isSubmitting }) => (
                            <Form onSubmit={handleSubmit}>
                                {loginError && <Alert variant="danger">{loginError}</Alert>}
                                <div className="form-group">
                                    <label>Email address</label>
                                    <Field name="email" type="email" className="form-control" />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                </div>
                                <div className="form-group mt-3">
                                    <label>Password</label>
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
