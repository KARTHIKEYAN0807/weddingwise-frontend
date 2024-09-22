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
            fetchBookedData(); // Fetch both event and vendor bookings after login
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

    // Fetch booked events and vendors from the database
    const fetchBookedData = async () => {
        try {
            setLoading(true);
            const eventResponse = await axios.get(`${API_BASE_URL}/api/events/bookings`);
            const vendorResponse = await axios.get(`${API_BASE_URL}/api/vendors/bookings`);
            setBookedEvents(eventResponse.data.bookedEvents);
            setBookedVendors(vendorResponse.data.bookedVendors);
        } catch (error) {
            console.error('Error fetching bookings:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add new event booking (immediately store in database)
    const addEventBooking = async (booking) => {
        if (!booking.eventTitle) {
            alert('Event title is required.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/events/book`, booking);
            const savedEventBooking = response.data.data;
            setBookedEvents([...bookedEvents, savedEventBooking]);
        } catch (error) {
            console.error('Error booking event:', error.response?.data || error.message);
            alert('Error booking event. Please try again.');
        }
    };

    // Add new vendor booking (immediately store in database)
    const addVendorBooking = async (booking) => {
        if (!booking.vendorName || !booking.name || !booking.email || !booking.date) {
            alert('All fields are required for vendor booking.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/vendors/book`, booking);
            const savedVendorBooking = response.data.data;
            setBookedVendors([...bookedVendors, savedVendorBooking]);
        } catch (error) {
            console.error('Error booking vendor:', error.response?.data || error.message);
            alert('Error booking vendor. Please try again.');
        }
    };

    // Delete event booking
    const deleteEventBooking = async (eventId) => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/events/${eventId}`);
            setBookedEvents(bookedEvents.filter((event) => event._id !== eventId));
        } catch (error) {
            console.error('Error deleting booking:', error.message || error.response?.data);
            alert('Error deleting booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Delete vendor booking
    const deleteVendorBooking = async (vendorId) => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/vendors/bookings/${vendorId}`);
            setBookedVendors(bookedVendors.filter((vendor) => vendor._id !== vendorId));
        } catch (error) {
            console.error('Error deleting vendor booking:', error.message || error.response?.data);
            alert('Error deleting vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update event booking
    const updateEventBooking = async (eventId, updatedBooking) => {
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/api/events/${eventId}`, updatedBooking);
            const updatedEvents = bookedEvents.map((event) =>
                event._id === eventId ? { ...event, ...updatedBooking } : event
            );
            setBookedEvents(updatedEvents);
        } catch (error) {
            console.error('Error updating booking:', error.message || error.response?.data);
            alert('Error updating booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update vendor booking
    const updateVendorBooking = async (vendorId, updatedBooking) => {
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/api/vendors/bookings/${vendorId}`, updatedBooking);
            const updatedVendors = bookedVendors.map((vendor) =>
                vendor._id === vendorId ? { ...vendor, ...updatedBooking } : vendor
            );
            setBookedVendors(updatedVendors);
        } catch (error) {
            console.error('Error updating vendor booking:', error.message || error.response?.data);
            alert('Error updating vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Confirm bookings (sends email and clears local storage)
    const confirmBookings = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/bookings/confirm-booking`, {
                bookedEvents,
                bookedVendors,
            });

            if (response.status === 200) {
                navigate('/booking-confirmation');
                alert('Booking confirmed and email sent!');
            }
        } catch (error) {
            console.error('Error confirming booking:', error.response?.data || error.message);
            alert('Error confirming booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load user and bookings from local storage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER);
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                fetchBookedData(); // Fetch event and vendor bookings after login
            } catch (error) {
                console.error('Error parsing stored user:', error);
                logoutUser();
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
                confirmBookings,
                darkMode,
                toggleDarkMode,
                loginUser,
                logoutUser,
                loading,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
