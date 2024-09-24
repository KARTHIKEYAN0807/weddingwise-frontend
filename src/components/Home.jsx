// src/components/Home.jsx
import React from 'react';
import { Row, Col, Button, Carousel, Card, Container } from 'react-bootstrap';
import 'animate.css';

const Home = () => (
  <div className="home-page text-center animate__animated animate__fadeIn">
    <Container className="home-content p-5">
      <Row className="align-items-center">
        <Col>
          <h1 className="display-4">Plan Your Dream Wedding</h1>
          <p className="lead">With WeddingWise, you can plan every detail of your big day effortlessly.</p>
          <Button variant="primary" href="/events" className="animate__animated animate__pulse animate__infinite">Start Planning</Button>
        </Col>
      </Row>

      {/* Showcase Carousel */}
      <Row className="mt-5">
        <Col>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/images/wedding_ceremony.jpg"
                alt="Wedding Ceremony"
              />
              <Carousel.Caption>
                <h3>Wedding Ceremony</h3>
                <p>A beautiful start to a lifetime together.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/images/reception.jpg"
                alt="Reception"
              />
              <Carousel.Caption>
                <h3>Reception</h3>
                <p>Celebrate with friends and family.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/images/engagement_party.jpg"
                alt="Engagement Party"
              />
              <Carousel.Caption>
                <h3>Engagement Party</h3>
                <p>Celebrate your engagement with loved ones.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/images/bridal_shower.jpg"
                alt="Bridal Shower"
              />
              <Carousel.Caption>
                <h3>Bridal Shower</h3>
                <p>A special party for the bride-to-be.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>

      {/* Services Section */}
      <div className="services-section mt-5">
        <h2 className="animate__animated animate__fadeInUp">Services We Offer</h2>
        <Row className="mt-4">
          <Col md={4} className="animate__animated animate__fadeInLeft">
            <Card className="mb-4 shadow">
              <Card.Img variant="top" src="/images/catering.jpg" />
              <Card.Body>
                <Card.Title>Exquisite Catering</Card.Title>
                <Card.Text>
                  Delicious menus tailored to your preferences, from gourmet dinners to casual buffets.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="animate__animated animate__fadeInUp">
            <Card className="mb-4 shadow">
              <Card.Img variant="top" src="/images/photography.jpg" />
              <Card.Body>
                <Card.Title>Professional Photography</Card.Title>
                <Card.Text>
                  Capture every special moment with our expert photographers and videographers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="animate__animated animate__fadeInRight">
            <Card className="mb-4 shadow">
              <Card.Img variant="top" src="/images/florist.jpg" />
              <Card.Body>
                <Card.Title>Elegant Floristry</Card.Title>
                <Card.Text>
                  Stunning floral arrangements to add a touch of elegance to your special day.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section mt-5">
        <h2 className="animate__animated animate__fadeInUp">Gallery</h2>
        <Row className="mt-4">
          <Col md={4} className="animate__animated animate__fadeInLeft">
            <img src="/images/gallery1.jpg" alt="Gallery Image 1" className="img-fluid rounded mb-4 shadow" />
          </Col>
          <Col md={4} className="animate__animated animate__fadeInUp">
            <img src="/images/gallery2.jpg" alt="Gallery Image 2" className="img-fluid rounded mb-4 shadow" />
          </Col>
          <Col md={4} className="animate__animated animate__fadeInRight">
            <img src="/images/gallery3.jpg" alt="Gallery Image 3" className="img-fluid rounded mb-4 shadow" />
          </Col>
        </Row>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section mt-5">
        <h2 className="animate__animated animate__fadeInUp">What Our Clients Say</h2>
        <Row className="mt-4">
          <Col md={6} className="animate__animated animate__fadeInLeft">
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Text>
                  "WeddingWise made our wedding day truly unforgettable. Their attention to detail and professionalism were outstanding!"
                </Card.Text>
                <Card.Footer className="text-muted">- Emily & John</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="animate__animated animate__fadeInRight">
            <Card className="mb-4 shadow">
              <Card.Body>
                <Card.Text>
                  "The team at WeddingWise took all the stress out of planning our wedding. We couldn't be happier with their services!"
                </Card.Text>
                <Card.Footer className="text-muted">- Sarah & Mike</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  </div>
);

export default Home;