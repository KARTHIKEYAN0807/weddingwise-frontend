import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export const AppContext = createContext();

const API_BASE_URL = 'https://weddingwisebooking.onrender.com';

// Constants for localStorage keys
const LOCAL_STORAGE_USER = 'currentUser';
const LOCAL_STORAGE_TOKEN = 'authToken';
const LOCAL_STORAGE_DARK_MODE = 'darkMode';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [bookedEvents, setBookedEvents] = useState([]);
    const [bookedVendors, setBookedVendors] = useState([]);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem(LOCAL_STORAGE_DARK_MODE) === 'true');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Save dark mode preference in localStorage when it changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_DARK_MODE, darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const loginUser = (userData, token) => {
        if (token) {
            setUser(userData);
            localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(userData));
            localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchBookedData(); // Fetch bookings after login
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
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const fetchBookedData = async () => {
        try {
            setLoading(true);
            const [eventResponse, vendorResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/events/bookings`),
                axios.get(`${API_BASE_URL}/api/vendors/bookings`),
            ]);
            setBookedEvents(eventResponse.data.bookedEvents || []); // Handle potential undefined responses
            setBookedVendors(vendorResponse.data.bookedVendors || []);
        } catch (error) {
            console.error('Error fetching bookings:', error.response?.data || error.message);
            alert('Failed to fetch bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const addEventBooking = async (booking) => {
        if (!booking.eventName) {
            alert('Event name is required.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/events/book`, booking);
            setBookedEvents((prev) => [...prev, response.data.data]);
        } catch (error) {
            console.error('Error booking event:', error.response?.data || error.message);
            alert('Error booking event. Please try again.');
        }
    };

    const addVendorBooking = async (booking) => {
        if (!booking.vendorName || !booking.name || !booking.email || !booking.date) {
            alert('All fields are required for vendor booking.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/vendors/book`, booking);
            setBookedVendors((prev) => [...prev, response.data.data]);
        } catch (error) {
            console.error('Error booking vendor:', error.response?.data || error.message);
            alert('Error booking vendor. Please try again.');
        }
    };

    const deleteEventBooking = async (eventId) => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/events/bookings/${eventId}`);
            setBookedEvents((prev) => prev.filter((event) => event._id !== eventId));
        } catch (error) {
            console.error('Error deleting event booking:', error.message || error.response?.data);
            alert('Error deleting booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteVendorBooking = async (vendorId) => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/api/vendors/bookings/${vendorId}`);
            setBookedVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
        } catch (error) {
            console.error('Error deleting vendor booking:', error.message || error.response?.data);
            alert('Error deleting vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateEventBooking = async (eventId, updatedBooking) => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/api/events/bookings/${eventId}`, updatedBooking);
            setBookedEvents((prev) =>
                prev.map((event) => (event._id === eventId ? response.data.data : event))
            );
        } catch (error) {
            console.error('Error updating booking:', error.message || error.response?.data);
            alert('Error updating booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateVendorBooking = async (vendorId, updatedBooking) => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}/api/vendors/bookings/${vendorId}`, updatedBooking);
            setBookedVendors((prev) =>
                prev.map((vendor) => (vendor._id === vendorId ? response.data.data : vendor))
            );
        } catch (error) {
            console.error('Error updating vendor booking:', error.message || error.response?.data);
            alert('Error updating vendor booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user data and token from local storage and authenticate on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER);
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                fetchBookedData();
            } catch (error) {
                console.error('Error parsing stored user:', error);
                logoutUser();
            }
        } else {
            setLoading(false);
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
                loading,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
