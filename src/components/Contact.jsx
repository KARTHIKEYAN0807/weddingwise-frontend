import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string().required('Message is required'),
});

const Contact = () => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading

  return (
    <Container className="animate__animated animate__fadeInUp mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          {/* Page Title */}
          <h1 className="text-center mb-4">Contact Us</h1>

          {/* Showcase Image */}
          <img src="/images/contact_showcase.jpg" alt="Contact Showcase" className="img-fluid mb-4" />

          <h2 className="text-center">We'd love to hear from you</h2>
          <Formik
            initialValues={{ name: '', email: '', message: '' }}
            validationSchema={ContactSchema}
            onSubmit={async (values, { resetForm }) => {
              setIsLoading(true); // Start loading
              try {
                // Send the form data to the backend
                const response = await axios.post('https://weddingwisebooking.onrender.com/api/contact', values); // Corrected endpoint
                setStatusMessage({ type: 'success', text: response.data.msg });
                resetForm();
              } catch (error) {
                console.error('Error sending email:', error);
                setStatusMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
              } finally {
                setIsLoading(false); // Stop loading
              }
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {statusMessage && (
                  <Alert variant={statusMessage.type === 'success' ? 'success' : 'danger'}>
                    {statusMessage.text}
                  </Alert>
                )}
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
                  <label>Message</label>
                  <Field name="message" as="textarea" className="form-control" />
                  <ErrorMessage name="message" component="div" className="text-danger" />
                </div>
                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {' Sending...'}
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;