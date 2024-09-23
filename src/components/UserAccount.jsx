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
        confirmBookings,
        loading
    } = useContext(AppContext);

    const [editingEvent, setEditingEvent] = useState(null);
    const [editingVendor, setEditingVendor] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVendorDeleteModal, setShowVendorDeleteModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [error, setError] = useState('');

    // Redirect if not logged in
    if (!user) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    You need to be logged in to view your account. <a href="/login" className="alert-link">Login here</a>.
                </Alert>
            </Container>
        );
    }

    // Handle editing an event
    const handleEventEdit = (event) => {
        setEditingEvent(event);
        setShowEventModal(true);
    };

    // Handle editing a vendor
    const handleVendorEdit = (vendor) => {
        setEditingVendor(vendor);
        setShowVendorModal(true);
    };

    // Save changes to an event booking
    const handleSaveEventChanges = async (e) => {
        e.preventDefault();
        try {
            if (!editingEvent.name || !editingEvent.email || !editingEvent.guests || !editingEvent.date) {
                setError('All fields, including event name, email, guests, and date, are required.');
                return;
            }

            const updatedData = { ...editingEvent };

            await updateEventBooking(editingEvent._id, updatedData);
            setShowEventModal(false);
            setFeedbackMessage('Event booking successfully updated.');
            setError('');
        } catch (err) {
            setError('Error updating the event booking. Please try again.');
        }
    };

    // Save changes to a vendor booking
    const handleSaveVendorChanges = async (e) => {
        e.preventDefault();
        try {
            if (!editingVendor.vendorName || !editingVendor.email || !editingVendor.date || !editingVendor.guests) {
                setError('All fields are required for the vendor, including vendor name, email, guests, and date.');
                return;
            }

            const updatedData = { ...editingVendor };

            await updateVendorBooking(editingVendor._id, updatedData);
            setShowVendorModal(false);
            setFeedbackMessage('Vendor booking successfully updated.');
            setError('');
        } catch (err) {
            setError('Error updating the vendor booking. Please try again.');
        }
    };

    // Confirm event deletion
    const confirmEventDelete = async () => {
        try {
            await deleteEventBooking(editingEvent._id);
            setShowDeleteModal(false);
            setFeedbackMessage('Event booking successfully deleted.');
            setEditingEvent(null);
        } catch (err) {
            setError('Error deleting the event booking. Please try again.');
        }
    };

    // Confirm vendor deletion
    const confirmVendorDelete = async () => {
        try {
            await deleteVendorBooking(editingVendor._id);
            setShowVendorDeleteModal(false);
            setFeedbackMessage('Vendor booking successfully deleted.');
            setEditingVendor(null);
        } catch (err) {
            setError('Error deleting the vendor booking. Please try again.');
        }
    };

    // Close modals and reset state
    const handleCloseEventModal = () => {
        setShowEventModal(false);
        setEditingEvent(null);
        setFeedbackMessage('');
        setError('');
    };

    const handleCloseVendorModal = () => {
        setShowVendorModal(false);
        setEditingVendor(null);
        setFeedbackMessage('');
        setError('');
    };

    return (
        <Container className="animate__animated animate__fadeInUp mt-5">
            <h1 className="text-center mb-4">Welcome, {user.name}</h1>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {feedbackMessage && <Alert variant="success" className="mt-3">{feedbackMessage}</Alert>}

            {/* Booked Events Section */}
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
                        {bookedEvents.map((event) => (
                            <tr key={event._id}>
                                <td>{event.name || 'Untitled Event'}</td>
                                <td>{event.userName}</td>
                                <td>{event.email}</td>
                                <td>{event.guests}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEventEdit(event)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => { setEditingEvent(event); setShowDeleteModal(true); }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Booked Vendors Section */}
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
                        {bookedVendors.map((vendor) => (
                            <tr key={vendor._id}>
                                <td>{vendor.vendorName}</td>
                                <td>{vendor.userName}</td>
                                <td>{vendor.email}</td>
                                <td>{vendor.guests}</td>
                                <td>{new Date(vendor.date).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleVendorEdit(vendor)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => { setEditingVendor(vendor); setShowVendorDeleteModal(true); }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Confirm Bookings Button */}
            <Button variant="success" onClick={confirmBookings} className="mt-3" disabled={loading}>
                {loading ? (
                    <Spinner animation="border" size="sm" />
                ) : (
                    'Confirm Bookings'
                )}
            </Button>

            {/* Modal for editing events */}
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
                                value={editingEvent?.name || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserName" className="mt-2">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingEvent?.userName || user.name}
                                onChange={(e) => setEditingEvent({ ...editingEvent, userName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={editingEvent?.email || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formGuests" className="mt-2">
                            <Form.Label>Number of Guests</Form.Label>
                            <Form.Control
                                type="number"
                                value={editingEvent?.guests || ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, guests: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDate" className="mt-2">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={editingEvent?.date ? new Date(editingEvent.date).toISOString().split('T')[0] : ''}
                                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for editing vendors */}
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
                                value={editingVendor?.vendorName || ''}
                                onChange={(e) => setEditingVendor({ ...editingVendor, vendorName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserName" className="mt-2">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingVendor?.userName || user.name}
                                onChange={(e) => setEditingVendor({ ...editingVendor, userName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={editingVendor?.email || ''}
                                onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formGuests" className="mt-2">
                            <Form.Label>Number of Guests</Form.Label>
                            <Form.Control
                                type="number"
                                value={editingVendor?.guests || ''}
                                onChange={(e) => setEditingVendor({ ...editingVendor, guests: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDate" className="mt-2">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={editingVendor?.date ? new Date(editingVendor.date).toISOString().split('T')[0] : ''}
                                onChange={(e) => setEditingVendor({ ...editingVendor, date: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for deleting events */}
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
                    <Button variant="danger" onClick={confirmEventDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for deleting vendors */}
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
                    <Button variant="danger" onClick={confirmVendorDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserAccount;
