import React, { useContext, useState } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';

const UserAccount = () => {
  const {
    user,
    bookedEvents,
    bookedVendors,
    deleteEventBooking,
    updateEventBooking,
    deleteVendorBooking,
    updateVendorBooking,
    loading
  } = useContext(AppContext);

  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [editingVendorIndex, setEditingVendorIndex] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [editEventData, setEditEventData] = useState({ eventId: '', eventName: '', userName: '', email: '', guests: '', date: '' });
  const [editVendorData, setEditVendorData] = useState({ vendorName: '', userName: '', email: '', date: '', guests: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVendorDeleteModal, setShowVendorDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [error, setError] = useState('');
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [deletingVendor, setDeletingVendor] = useState(false);

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          You need to be logged in to view your account. <a href="/login" className="alert-link">Login here</a>.
        </Alert>
      </Container>
    );
  }

  const handleEventEdit = (index) => {
    const eventToEdit = bookedEvents[index];
    setEditEventData({
      eventId: eventToEdit._id || '',
      eventName: eventToEdit.name || 'Untitled Event',
      userName: eventToEdit.userName || user.name || '',
      email: eventToEdit.email || user.email || '',
      guests: eventToEdit.guests || '',
      date: eventToEdit.date || ''
    });
    setEditingEventIndex(index);
    setShowEventModal(true);
  };

  const handleVendorEdit = (index) => {
    const vendorToEdit = bookedVendors[index];
    setEditVendorData({
      vendorName: vendorToEdit.vendorName || '',
      userName: vendorToEdit.userName || user.name || '',
      email: vendorToEdit.email || '',
      date: vendorToEdit.date || '',
      guests: vendorToEdit.guests || ''
    });
    setEditingVendorIndex(index);
    setShowVendorModal(true);
  };

  const handleSaveEventChanges = async (e) => {
    e.preventDefault();
    try {
      const { eventId, eventName, userName, email, guests, date } = editEventData;

      if (!eventId || !eventName || !userName || !email || !guests || !date) {
        setError('All fields, including the event name, user name, email, guests, and date, are required.');
        return;
      }

      if (parseInt(guests, 10) <= 0) {
        setError('Guests must be a valid positive number.');
        return;
      }

      const updatedData = {
        eventId,
        eventName,
        userName,
        email,
        guests: parseInt(guests, 10),
        date
      };

      await updateEventBooking(editingEventIndex, updatedData);
      setShowEventModal(false);
      setFeedbackMessage('Event booking successfully updated.');
      setError('');
    } catch (err) {
      setError('Error updating the event booking. Please try again.');
    }
  };

  const handleSaveVendorChanges = async (e) => {
    e.preventDefault();
    try {
      const { vendorName, userName, email, date, guests } = editVendorData;

      if (!vendorName || !userName || !email || !date || !guests) {
        setError('All fields are required for the vendor, including the number of guests and booking date.');
        return;
      }

      const updatedData = { vendorName, userName, email, date, guests };

      await updateVendorBooking(editingVendorIndex, updatedData);
      setShowVendorModal(false);
      setFeedbackMessage('Vendor booking successfully updated.');
      setError('');
    } catch (err) {
      setError('Error updating the vendor booking. Please try again.');
    }
  };

  const confirmEventDelete = async () => {
    setDeletingEvent(true);
    try {
      await deleteEventBooking(editingEventIndex);
      setShowDeleteModal(false);
      setFeedbackMessage('Event booking successfully deleted.');
      setEditingEventIndex(null);
    } catch (err) {
      setError('Error deleting the event booking. Please try again.');
    } finally {
      setDeletingEvent(false);
    }
  };

  const confirmVendorDelete = async () => {
    setDeletingVendor(true);
    try {
      await deleteVendorBooking(editingVendorIndex);
      setShowVendorDeleteModal(false);
      setFeedbackMessage('Vendor booking successfully deleted.');
      setEditingVendorIndex(null);
    } catch (err) {
      setError('Error deleting the vendor booking. Please try again.');
    } finally {
      setDeletingVendor(false);
    }
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setEditEventData({ eventId: '', eventName: '', userName: '', email: '', guests: '', date: '' });
    setFeedbackMessage('');
    setError('');
  };

  const handleCloseVendorModal = () => {
    setShowVendorModal(false);
    setEditVendorData({ vendorName: '', userName: '', email: '', date: '', guests: '' });
    setFeedbackMessage('');
    setError('');
  };

  return (
    <Container className="animate__animated animate__fadeInUp mt-5">
      <h1 className="text-center mb-4">Welcome, {user.name}</h1>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {feedbackMessage && <Alert variant="success" className="mt-3">{feedbackMessage}</Alert>}

      <h2>Booked Events</h2>
      {bookedEvents.length === 0 ? (
        <Alert variant="info" className="mt-3">No events booked yet.</Alert>
      ) : (
        <Table striped bordered hover className="mt-4 animate__animated animate__fadeIn">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Your Name</th>
              <th>Email</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookedEvents.map((event, index) => (
              <tr key={`event-${index}`}>
                <td>{event.name || 'Untitled Event'}</td>
                <td>{event.userName}</td>
                <td>{event.email}</td>
                <td>{event.guests}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEventEdit(index)}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => { setEditingEventIndex(index); setShowDeleteModal(true); }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h2>Booked Vendors</h2>
      {bookedVendors.length === 0 ? (
        <Alert variant="info" className="mt-3">No vendors booked yet.</Alert>
      ) : (
        <Table striped bordered hover className="mt-4 animate__animated animate__fadeIn">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Your Name</th>
              <th>Email</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookedVendors.map((vendor, index) => (
              <tr key={`vendor-${index}`}>
                <td>{vendor.vendorName}</td>
                <td>{vendor.userName}</td>
                <td>{vendor.email}</td>
                <td>{vendor.guests}</td>
                <td>{new Date(vendor.date).toLocaleDateString()}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleVendorEdit(index)}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => { setEditingVendorIndex(index); setShowVendorDeleteModal(true); }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button variant="success" onClick={() => confirmBookings()} className="mt-3" disabled={loading}>
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          'Confirm Bookings'
        )}
      </Button>

      <Modal show={showEventModal} onHide={handleCloseEventModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEventChanges}>
            <Form.Group controlId="formEventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.eventName}
                onChange={(e) => setEditEventData({ ...editEventData, eventName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserName" className="mt-2">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.userName}
                onChange={(e) => setEditEventData({ ...editEventData, userName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editEventData.email}
                onChange={(e) => setEditEventData({ ...editEventData, email: e.target.value })}
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

      <Modal show={showVendorModal} onHide={handleCloseVendorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vendor Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveVendorChanges}>
            <Form.Group controlId="formVendorName">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                value={editVendorData.vendorName}
                onChange={(e) => setEditVendorData({ ...editVendorData, vendorName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserName" className="mt-2">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                value={editVendorData.userName}
                onChange={(e) => setEditVendorData({ ...editVendorData, userName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editVendorData.email}
                onChange={(e) => setEditVendorData({ ...editVendorData, email: e.target.value })}
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this event booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmEventDelete} disabled={deletingEvent}>
            {deletingEvent ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showVendorDeleteModal} onHide={() => setShowVendorDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Vendor Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this vendor booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVendorDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmVendorDelete} disabled={deletingVendor}>
            {deletingVendor ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserAccount;
