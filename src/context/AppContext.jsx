import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export const AppContext = createContext();

const API_BASE_URL = 'https://weddingwisebooking.onrender.com';

// Constants for localStorage keys
const LOCAL_STORAGE_USER = 'currentUser';
const LOCAL_STORAGE_TOKEN = 'authToken';
const LOCAL_STORAGE_BOOKED_EVENTS = 'bookedEvents';
const LOCAL_STORAGE_BOOKED_VENDORS = 'bookedVendors';
const LOCAL_STORAGE_DARK_MODE = 'darkMode';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [bookedEvents, setBookedEvents] = useState([]);
    const [bookedVendors, setBookedVendors] = useState([]);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem(LOCAL_STORAGE_DARK_MODE) === 'true');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Store dark mode setting in localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_DARK_MODE, darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Log in user and store data in local storage
    const loginUser = (userData, token) => {
        if (token) {
            setUser(userData);
            localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(userData));
            localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            console.error('Invalid token');
        }
    };

    const logoutUser = () => {
        setUser(null);
        setBookedEvents([]);
        setBookedVendors([]);
        localStorage.removeItem(LOCAL_STORAGE_USER);
        localStorage.removeItem(LOCAL_STORAGE_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_BOOKED_EVENTS);
        localStorage.removeItem(LOCAL_STORAGE_BOOKED_VENDORS);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    // Refresh token function to handle expired tokens
    const refreshAuthToken = async () => {
        try {
            const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { token });
            const newToken = response.data.token;
            localStorage.setItem(LOCAL_STORAGE_TOKEN, newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            return newToken;
        } catch (error) {
            console.error('Error refreshing token:', error.message || error.response?.data);
            logoutUser();
            return null;
        }
    };

    // Intercept axios responses to handle expired tokens
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && error.response.data.msg === 'Token has expired') {
                    try {
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
            axios.interceptors.response.eject(interceptor); // Clean up interceptor
        };
    }, []);

    // Add new event booking
    const addEventBooking = (booking) => {
        if (!booking.eventTitle) {
            alert('Event title is required.');
            return;
        }

        const eventWithId = {
            ...booking,
            _id: booking._id || `local-${Date.now()}-${Math.random()}` // Generate unique ID for local events
        };
        const updatedBookedEvents = [...bookedEvents, eventWithId];
        setBookedEvents(updatedBookedEvents);
        localStorage.setItem(LOCAL_STORAGE_BOOKED_EVENTS, JSON.stringify(updatedBookedEvents));
    };

    // Add new vendor booking
    const addVendorBooking = async (booking) => {
        if (!booking.vendorName || !booking.name || !booking.email || !booking.date) {
            alert('All fields are required for vendor booking.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/vendors/book`, booking);
            const savedVendorBooking = response.data.data;

            const updatedBookedVendors = [...bookedVendors, savedVendorBooking];
            setBookedVendors(updatedBookedVendors);
            localStorage.setItem(LOCAL_STORAGE_BOOKED_VENDORS, JSON.stringify(updatedBookedVendors));
        } catch (error) {
            console.error('Error booking vendor:', error.response?.data || error.message);
            alert('Error booking vendor. Please try again.');
        }
    };

    // Fetch all booked vendors after login or refresh
    const fetchBookedVendors = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/vendors/bookings`);
            setBookedVendors(response.data.bookedVendors); // Update state with fetched vendor bookings
        } catch (error) {
            console.error('Error fetching booked vendors:', error.response?.data || error.message);
        }
    };

    // Delete event booking
    const deleteEventBooking = async (index) => {
        setLoading(true);
        try {
            const event = bookedEvents[index];
            const eventId = event._id;

            if (eventId && !eventId.startsWith('local-')) {
                await axios.delete(`${API_BASE_URL}/api/events/${eventId}`);
            }

            const updatedBookedEvents = bookedEvents.filter((_, i) => i !== index);
            setBookedEvents(updatedBookedEvents);
            localStorage.setItem(LOCAL_STORAGE_BOOKED_EVENTS, JSON.stringify(updatedBookedEvents));
        } catch (error) {
            console.error('Error deleting booking:', error.message || error.response?.data);
            alert('Error deleting booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update event booking
    const updateEventBooking = async (index, updatedBooking) => {
        setLoading(true);
        try {
            let event = bookedEvents[index];
            let eventId = event._id;

            if (!updatedBooking.eventTitle) {
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
            localStorage.setItem(LOCAL_STORAGE_BOOKED_EVENTS, JSON.stringify(updatedBookedEvents));
        } catch (error) {
            console.error('Error updating booking:', error.message || error.response?.data);
            alert('Error updating booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Delete vendor booking
    const deleteVendorBooking = async (index) => {
        setLoading(true);
        try {
            const vendor = bookedVendors[index];
            const vendorId = vendor._id;

            if (vendorId && !vendorId.startsWith('local-')) {
                await axios.delete(`${API_BASE_URL}/api/vendors/bookings/${vendorId}`);
            }

            const updatedBookedVendors = bookedVendors.filter((_, i) => i !== index);
            setBookedVendors(updatedBookedVendors);
            localStorage.setItem(LOCAL_STORAGE_BOOKED_VENDORS, JSON.stringify(updatedBookedVendors));
        } catch (error) {
            console.error('Error deleting vendor booking:', error.message || error.response?.data);
            alert('Error deleting vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update vendor booking
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
                date: updatedBooking.date,
                guests: updatedBooking.guests,
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
            localStorage.setItem(LOCAL_STORAGE_BOOKED_VENDORS, JSON.stringify(updatedBookedVendors));
        } catch (error) {
            console.error('Error updating vendor booking:', error.response?.data || error.message);
            alert('Error updating vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Confirm bookings
    const confirmBookings = async () => {
        setLoading(true);
        try {
            await refreshAuthToken();
            const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
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
                localStorage.removeItem(LOCAL_STORAGE_BOOKED_EVENTS);
                localStorage.removeItem(LOCAL_STORAGE_BOOKED_VENDORS);
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

    // Load user and bookings from local storage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER);
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
        const storedBookedEvents = localStorage.getItem(LOCAL_STORAGE_BOOKED_EVENTS);
        const storedBookedVendors = localStorage.getItem(LOCAL_STORAGE_BOOKED_VENDORS);

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error('Error parsing stored user:', error);
                logoutUser();
            }
        }

        if (storedBookedEvents) {
            try {
                const parsedBookedEvents = JSON.parse(storedBookedEvents).map(event => ({
                    ...event,
                    _id: event._id || `local-${Date.now()}-${Math.random()}` 
                }));
                setBookedEvents(parsedBookedEvents);
            } catch (error) {
                console.error('Error parsing booked events:', error);
                localStorage.removeItem(LOCAL_STORAGE_BOOKED_EVENTS);
            }
        }

        if (storedBookedVendors) {
            try {
                const parsedBookedVendors = JSON.parse(storedBookedVendors).map(vendor => ({
                    ...vendor,
                    _id: vendor._id || `local-${Date.now()}-${Math.random()}` 
                }));
                setBookedVendors(parsedBookedVendors);
            } catch (error) {
                console.error('Error parsing booked vendors:', error);
                localStorage.removeItem(LOCAL_STORAGE_BOOKED_VENDORS);
            }
        }

        setLoading(false);
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
