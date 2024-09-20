import React, { useContext, useState } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';

const UserAccount = () => {
    const { user, bookedEvents, bookedVendors, deleteEventBooking, updateEventBooking, deleteVendorBooking, updateVendorBooking, confirmBookings, loading } = useContext(AppContext);
    const [editingEventIndex, setEditingEventIndex] = useState(null);
    const [editingVendorIndex, setEditingVendorIndex] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [editEventData, setEditEventData] = useState({ eventId: '', eventTitle: '', name: '', email: '', guests: '' });
    const [editVendorData, setEditVendorData] = useState({ vendorName: '', name: '', email: '', date: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVendorDeleteModal, setShowVendorDeleteModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [error, setError] = useState('');

    // Log user data for debugging
    console.log('User from context:', user);

    if (!user) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    You need to be logged in to view your account. <a href="/login" className="alert-link">Login here</a>.
                </Alert>
            </Container>
        );
    }

    // Edit event handler
    const handleEventEdit = (index) => {
        const eventToEdit = bookedEvents[index];
        console.log('Event to Edit:', eventToEdit); // Log event for debugging
        setEditEventData({ 
            eventId: eventToEdit._id || '', // Use eventId (_id from MongoDB)
            eventTitle: eventToEdit.eventTitle || 'Untitled Event',
            name: eventToEdit.name || '',
            email: eventToEdit.email || '',
            guests: eventToEdit.guests || ''
        });
        setEditingEventIndex(index);
        setShowEventModal(true);
    };

    // Edit vendor handler
    const handleVendorEdit = (index) => {
        const vendorToEdit = bookedVendors[index];
        console.log('Vendor to Edit:', vendorToEdit); // Log vendor for debugging
        setEditVendorData({ 
            vendorName: vendorToEdit.vendorName || '',
            name: vendorToEdit.name || '',
            email: vendorToEdit.email || '',
            date: vendorToEdit.date || '',
        });
        setEditingVendorIndex(index);
        setShowVendorModal(true);
    };

    // Delete event handler
    const handleEventDelete = (index) => {
        setEditingEventIndex(index);
        setShowDeleteModal(true);
    };

    // Delete vendor handler
    const handleVendorDelete = (index) => {
        setEditingVendorIndex(index);
        setShowVendorDeleteModal(true);
    };

    // Confirm event deletion
    const confirmEventDelete = async () => {
        try {
            await deleteEventBooking(editingEventIndex);
            setShowDeleteModal(false);
            setFeedbackMessage('Event booking successfully deleted.');
        } catch (err) {
            setError('Error deleting the event booking. Please try again.');
        }
    };

    // Confirm vendor deletion
    const confirmVendorDelete = async () => {
        try {
            await deleteVendorBooking(editingVendorIndex);
            setShowVendorDeleteModal(false);
            setFeedbackMessage('Vendor booking successfully deleted.');
        } catch (err) {
            setError('Error deleting the vendor booking. Please try again.');
        }
    };

    // Save event changes
    const handleSaveEventChanges = async (e) => {
        e.preventDefault();
        try {
            const { eventId, name, email, guests } = editEventData;

            if (!eventId || !name || !email || !guests) {
                setError('All fields are required for the event.');
                return;
            }

            const updatedData = {
                eventId, // Ensure to send eventId instead of eventTitle
                name,
                email,
                guests: parseInt(guests, 10) // Convert guests to number
            };

            console.log('Updated Event Data:', updatedData); // Log the data being sent

            await updateEventBooking(editingEventIndex, updatedData);
            setShowEventModal(false);
            setFeedbackMessage('Event booking successfully updated.');
        } catch (err) {
            setError('Error updating the event booking. Please try again.');
        }
    };

    // Save vendor changes
    const handleSaveVendorChanges = async (e) => {
        e.preventDefault();
        try {
            if (!editVendorData.vendorName || !editVendorData.name || !editVendorData.email || !editVendorData.date) {
                setError('All fields are required for the vendor.');
                return;
            }

            const updatedData = {
                ...editVendorData,
            };

            console.log('Updated Vendor Data:', updatedData); // Log the data being sent

            await updateVendorBooking(editingVendorIndex, updatedData);
            setShowVendorModal(false);
            setFeedbackMessage('Vendor booking successfully updated.');
        } catch (err) {
            setError('Error updating the vendor booking. Please try again.');
        }
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
                            <th>Event Title</th>
                            <th>Your Name</th>
                            <th>Email</th>
                            <th>Guests</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookedEvents.map((event, index) => (
                            <tr key={`event-${index}`}>
                                <td>{event.eventTitle || 'Untitled Event'}</td>
                                <td>{event.name}</td>
                                <td>{event.email}</td>
                                <td>{event.guests}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEventEdit(index)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleEventDelete(index)}>Delete</Button>
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
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookedVendors.map((vendor, index) => (
                            <tr key={`vendor-${index}`}>
                                <td>{vendor.vendorName}</td>
                                <td>{vendor.name}</td>
                                <td>{vendor.email}</td>
                                <td>{new Date(vendor.date).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleVendorEdit(index)}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => handleVendorDelete(index)}>Delete</Button>
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
            <Modal show={showEventModal} onHide={() => { setShowEventModal(false); setFeedbackMessage(''); setError(''); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveEventChanges}>
                        <Form.Group controlId="formEventTitle">
                            <Form.Label>Event Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editEventData.eventTitle}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formName" className="mt-2">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editEventData.name}
                                onChange={(e) => setEditEventData({ ...editEventData, name: e.target.value })}
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
                        <Button variant="primary" type="submit" className="mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for editing vendors */}
            <Modal show={showVendorModal} onHide={() => { setShowVendorModal(false); setFeedbackMessage(''); setError(''); }}>
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
                        <Form.Group controlId="formName" className="mt-2">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editVendorData.name}
                                onChange={(e) => setEditVendorData({ ...editVendorData, name: e.target.value })}
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
