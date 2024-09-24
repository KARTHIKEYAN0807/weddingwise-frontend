import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

// Create a context for the app
export const AppContext = createContext();

const API_BASE_URL = 'https://weddingwisebooking.onrender.com';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [bookedEvents, setBookedEvents] = useState([]);
    const [bookedVendors, setBookedVendors] = useState([]);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    const [loading, setLoading] = useState(false); // Loading state

    const navigate = useNavigate(); // Use navigate hook for redirection

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Log in user and store data in local storage
    const loginUser = (userData, token) => {
        if (token) {
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            console.error('Invalid token');
        }
    };

    const logoutUser = () => {
        setUser(null);
        setBookedEvents([]);
        setBookedVendors([]);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        // Redirect to login on logout
    };

    const refreshAuthToken = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { token });
            const newToken = response.data.token;
            localStorage.setItem('authToken', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            console.log('Token refreshed successfully');
            return newToken;
        } catch (error) {
            console.error('Error refreshing token:', error.message || error.response?.data);
            logoutUser();
            return null;
        }
    };

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && error.response.data.msg === 'Token has expired') {
                    try {
                        console.log('Token expired, attempting to refresh...');
                        const newToken = await refreshAuthToken();
                        if (newToken) {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        }
                    } catch (err) {
                        console.error('Token refresh failed:', err);
                        return Promise.reject(err);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const addEventBooking = (booking) => {
        if (!booking.title) {
            alert('Event title is required.');
            return;
        }

        const eventWithId = {
            ...booking,
            _id: booking._id || `local-${Date.now()}-${Math.random()}`
        };
        const updatedBookedEvents = [...bookedEvents, eventWithId];
        setBookedEvents(updatedBookedEvents);
        localStorage.setItem('bookedEvents', JSON.stringify(updatedBookedEvents));
    };

    const addVendorBooking = (booking) => {
        if (!booking.vendorName || !booking.name || !booking.email || !booking.date) {
            alert('All fields are required for vendor booking.');
            return;
        }

        const vendorWithId = {
            ...booking,
            _id: booking._id || `local-${Date.now()}-${Math.random()}`
        };
        const updatedBookedVendors = [...bookedVendors, vendorWithId];
        setBookedVendors(updatedBookedVendors);
        localStorage.setItem('bookedVendors', JSON.stringify(updatedBookedVendors));
    };

    const deleteEventBooking = async (index) => {
        setLoading(true);
        try {
            const event = bookedEvents[index];
            const eventId = event._id;

            if (eventId && !eventId.startsWith('local-')) {
                await axios.delete(`${API_BASE_URL}/api/events/${eventId}`);
            } else {
                console.warn('Skipping server request for local-only event:', event);
            }

            const updatedBookedEvents = bookedEvents.filter((_, i) => i !== index);
            setBookedEvents(updatedBookedEvents);
            localStorage.setItem('bookedEvents', JSON.stringify(updatedBookedEvents));
        } catch (error) {
            console.error('Error deleting booking:', error.message || error.response?.data);
            alert('Error deleting booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateEventBooking = async (index, updatedBooking) => {
        setLoading(true);
        try {
            let event = bookedEvents[index];
            let eventId = event._id;

            if (!updatedBooking.title) {
                alert('Event title is required.');
                setLoading(false);
                return;
            }

            if (eventId.startsWith('local-')) {
                const response = await axios.post(`${API_BASE_URL}/api/events`, updatedBooking);
                eventId = response.data._id;
            } else {
                await axios.put(`${API_BASE_URL}/api/events/${eventId}`, updatedBooking);
            }

            const updatedBookedEvents = bookedEvents.map((booking, i) =>
                i === index ? { ...booking, ...updatedBooking, _id: eventId } : booking
            );
            setBookedEvents(updatedBookedEvents);
            localStorage.setItem('bookedEvents', JSON.stringify(updatedBookedEvents));
        } catch (error) {
            console.error('Error updating booking:', error.message || error.response?.data);
            alert('Error updating booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteVendorBooking = async (index) => {
        setLoading(true);
        try {
            const vendor = bookedVendors[index];
            const vendorId = vendor._id;

            if (vendorId && !vendorId.startsWith('local-')) {
                await axios.delete(`${API_BASE_URL}/api/vendors/bookings/${vendorId}`);
            } else {
                console.warn('Skipping server request for local-only vendor:', vendor);
            }

            const updatedBookedVendors = bookedVendors.filter((_, i) => i !== index);
            setBookedVendors(updatedBookedVendors);
            localStorage.setItem('bookedVendors', JSON.stringify(updatedBookedVendors));
        } catch (error) {
            console.error('Error deleting vendor booking:', error.message || error.response?.data);
            alert('Error deleting vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateVendorBooking = async (index, updatedBooking) => {
        setLoading(true);
        try {
            const vendor = bookedVendors[index];
            let vendorId = vendor._id;

            if (!updatedBooking.vendorName || !updatedBooking.name || !updatedBooking.email || !updatedBooking.date) {
                alert('All fields are required.');
                setLoading(false);
                return;
            }

            const payload = {
                vendorName: updatedBooking.vendorName,
                name: updatedBooking.name,
                email: updatedBooking.email,
                date: updatedBooking.date
            };

            if (vendorId.startsWith('local-')) {
                const response = await axios.post(`${API_BASE_URL}/api/vendors/book`, payload);
                vendorId = response.data._id;
            } else {
                await axios.put(`${API_BASE_URL}/api/vendors/bookings/${vendorId}`, payload);
            }

            const updatedBookedVendors = bookedVendors.map((booking, i) =>
                i === index ? { ...booking, ...updatedBooking, _id: vendorId } : booking
            );
            setBookedVendors(updatedBookedVendors);
            localStorage.setItem('bookedVendors', JSON.stringify(updatedBookedVendors));
        } catch (error) {
            console.error('Error updating vendor booking:', error.response?.data || error.message);
            alert('Error updating vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const confirmBookings = async () => {
        setLoading(true);
        try {
            await refreshAuthToken();
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token has expired, please login again');
            }

            const vendorsToSave = bookedVendors.filter(vendor => vendor._id.startsWith('local-'));
            for (const vendor of vendorsToSave) {
                const response = await axios.post(`${API_BASE_URL}/api/vendors/book`, vendor);
                vendor._id = response.data._id;
            }

            const response = await axios.post(`${API_BASE_URL}/api/bookings/confirm-booking`, {
                bookedEvents,
                bookedVendors,
            });

            if (response.status === 200) {
                navigate('/booking-confirmation');

                setBookedEvents([]);
                setBookedVendors([]);
                localStorage.removeItem('bookedEvents');
                localStorage.removeItem('bookedVendors');

                setTimeout(() => {
                    alert('Booking confirmed and email sent!');
                }, 500);
            }
        } catch (error) {
            console.error('Error confirming booking:', error.response?.data || error.message);
            if (error.message.includes('Token has expired')) {
                alert('Session expired. Please log in again.');
                logoutUser();
            } else {
                alert('Error confirming booking. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken');
        const storedBookedEvents = localStorage.getItem('bookedEvents');
        const storedBookedVendors = localStorage.getItem('bookedVendors');

        console.log('User:', storedUser);  // Added console log for debugging
        console.log('Token:', token);

        if (storedUser && storedUser !== "undefined" && token && token !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error('Error parsing stored user:', error);
                logoutUser();
            }
        } else {
            logoutUser();
        }

        if (storedBookedEvents && storedBookedEvents !== "undefined") {
            try {
                const parsedBookedEvents = JSON.parse(storedBookedEvents).map(event => ({
                    ...event,
                    _id: event._id || `local-${Date.now()}-${Math.random()}`
                }));
                setBookedEvents(parsedBookedEvents);
            } catch (error) {
                console.error('Error parsing booked events:', error);
                localStorage.removeItem('bookedEvents');
            }
        }

        if (storedBookedVendors && storedBookedVendors !== "undefined") {
            try {
                const parsedBookedVendors = JSON.parse(storedBookedVendors).map(vendor => ({
                    ...vendor,
                    _id: vendor._id || `local-${Date.now()}-${Math.random()}`
                }));
                setBookedVendors(parsedBookedVendors);
            } catch (error) {
                console.error('Error parsing booked vendors:', error);
                localStorage.removeItem('bookedVendors');
            }
        }
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <AppContext.Provider
            value={{
                user,
                bookedEvents,
                bookedVendors,
                addEventBooking,
                addVendorBooking,
                deleteEventBooking,
                updateEventBooking,
                deleteVendorBooking,
                updateVendorBooking,
                darkMode,
                toggleDarkMode,
                loginUser,
                logoutUser,
                confirmBookings,
                loading,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
