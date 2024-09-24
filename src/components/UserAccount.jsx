import React, { useContext, useState } from 'react';
import { Container, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const UserAccount = () => {
  const {
    user,
    confirmBookings,
    cartEvents,
    cartVendors,
    removeFromCart,
    updateEventBooking,
    updateVendorBooking,
  } = useContext(AppContext);

  const navigate = useNavigate();

  // State for editing events and vendors in the cart
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [editingVendorIndex, setEditingVendorIndex] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [editEventData, setEditEventData] = useState({
    eventName: '',
    guests: '',
    date: ''
  });
  const [editVendorData, setEditVendorData] = useState({
    vendorName: '',
    guests: '',
    date: ''
  });
  const [error, setError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Editing functionality for events/vendors in the cart
  const handleEdit = (index, type) => {
    if (type === 'event') {
      const eventToEdit = cartEvents[index];
      setEditEventData(eventToEdit);
      setEditingEventIndex(index);
      setShowEventModal(true);
    } else if (type === 'vendor') {
      const vendorToEdit = cartVendors[index];
      setEditVendorData(vendorToEdit);
      setEditingVendorIndex(index);
      setShowVendorModal(true);
    }
  };

  const handleSaveChanges = (type) => {
    if (type === 'event') {
      const updatedEvents = [...cartEvents];
      updatedEvents[editingEventIndex] = editEventData;
      updateEventBooking(editingEventIndex, updatedEvents[editingEventIndex]);
      setShowEventModal(false);
    } else if (type === 'vendor') {
      const updatedVendors = [...cartVendors];
      updatedVendors[editingVendorIndex] = editVendorData;
      updateVendorBooking(editingVendorIndex, updatedVendors[editingVendorIndex]);
      setShowVendorModal(false);
    }
    setFeedbackMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} updated.`);
  };

  // Confirm booking and save to database
  const confirmBooking = async () => {
    if (cartEvents.length === 0 && cartVendors.length === 0) {
      setError('Your cart is empty. Please add events or vendors before confirming.');
      return;
    }

    try {
      await confirmBookings();
      navigate('/booking-confirmation');
      setFeedbackMessage('Booking confirmed successfully!');
    } catch (error) {
      setError('Error confirming booking. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Welcome, {user?.name || 'User'}</h1>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {feedbackMessage && <Alert variant="success" className="mt-3">{feedbackMessage}</Alert>}

      <h2>Cart - Events</h2>
      {cartEvents.length === 0 ? (
        <Alert variant="info" className="mt-3">No events in cart yet.</Alert>
      ) : (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartEvents.map((event, index) => (
              <tr key={`event-${index}`}>
                <td>{event.eventName}</td>
                <td>{event.guests}</td>
                <td>{event.date}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(index, 'event')}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(event._id, 'event')}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h2>Cart - Vendors</h2>
      {cartVendors.length === 0 ? (
        <Alert variant="info" className="mt-3">No vendors in cart yet.</Alert>
      ) : (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartVendors.map((vendor, index) => (
              <tr key={`vendor-${index}`}>
                <td>{vendor.vendorName}</td>
                <td>{vendor.guests}</td>
                <td>{vendor.date}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(index, 'vendor')}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(vendor._id, 'vendor')}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {(cartEvents.length > 0 || cartVendors.length > 0) && (
        <Button variant="success" className="mt-4" onClick={confirmBooking}>
          Confirm Booking
        </Button>
      )}

      {/* Event Edit Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleSaveChanges('event'); }}>
            <Form.Group controlId="formEventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.eventName}
                onChange={(e) => setEditEventData({ ...editEventData, eventName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGuests" className="mt-2">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Control
                type="number"
                value={editEventData.guests}
                onChange={(e) => setEditEventData({ ...editEventData, guests: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mt-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editEventData.date}
                onChange={(e) => setEditEventData({ ...editEventData, date: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Vendor Edit Modal */}
      <Modal show={showVendorModal} onHide={() => setShowVendorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => { e.preventDefault(); handleSaveChanges('vendor'); }}>
            <Form.Group controlId="formVendorName">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                value={editVendorData.vendorName}
                onChange={(e) => setEditVendorData({ ...editVendorData, vendorName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGuests" className="mt-2">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Control
                type="number"
                value={editVendorData.guests}
                onChange={(e) => setEditVendorData({ ...editVendorData, guests: e.target.value })} 
                required
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mt-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editVendorData.date}
                onChange={(e) => setEditVendorData({ ...editVendorData, date: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserAccount;
