import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export const AppContext = createContext();

const API_BASE_URL = 'https://weddingwisebooking.onrender.com';

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [bookedEvents, setBookedEvents] = useState([]);
    const [bookedVendors, setBookedVendors] = useState([]);

    // Cart states to temporarily hold event/vendor bookings before confirmation
    const [cartEvents, setCartEvents] = useState([]);
    const [cartVendors, setCartVendors] = useState([]);

    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Save dark mode preference in localStorage when it changes
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const loginUser = (userData, token) => {
        if (token) {
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('authToken', token);
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
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const fetchBookedData = async () => {
        setLoading(true);
        try {
            const [eventResponse, vendorResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/events/bookings`),
                axios.get(`${API_BASE_URL}/api/vendors/bookings`),
            ]);

            setBookedEvents(eventResponse?.data?.bookedEvents || []);
            setBookedVendors(vendorResponse?.data?.bookedVendors || []);
        } catch (error) {
            console.error('Error fetching bookings:', error.response?.data || error.message);
            alert('Failed to fetch bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Add event/vendor to cart (not directly to booked data)
    const addToCart = (item, type) => {
        if (type === 'event') {
            setCartEvents((prev) => [...prev, item]);
        } else if (type === 'vendor') {
            setCartVendors((prev) => [...prev, item]);
        }
    };

    // Remove event/vendor from cart
    const removeFromCart = (id, type) => {
        if (type === 'event') {
            setCartEvents((prev) => prev.filter((event) => event._id !== id));
        } else if (type === 'vendor') {
            setCartVendors((prev) => prev.filter((vendor) => vendor._id !== id));
        }
    };

    // Confirm bookings from cart and save to database
    const confirmBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');

            const bookingResponse = await axios.post(
                `${API_BASE_URL}/api/bookings/confirm-booking`,
                {
                    bookedEvents: cartEvents,
                    bookedVendors: cartVendors,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (bookingResponse.data.success) {
                setBookedEvents((prev) => [...prev, ...cartEvents]);
                setBookedVendors((prev) => [...prev, ...cartVendors]);

                // Clear cart after successful booking
                setCartEvents([]);
                setCartVendors([]);
                navigate('/booking-confirmation');
            } else {
                alert('Failed to confirm bookings.');
            }
        } catch (error) {
            console.error('Error confirming bookings:', error.response?.data || error.message);
            alert('Error confirming bookings.');
        } finally {
            setLoading(false);
        }
    };

    const deleteEventBooking = (eventId) => {
        setBookedEvents((prev) => prev.filter((event) => event._id !== eventId));
    };

    const deleteVendorBooking = (vendorId) => {
        setBookedVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
    };

    const updateEventBooking = (eventId, updatedBooking) => {
        setBookedEvents((prev) =>
            prev.map((event) => (event._id === eventId ? updatedBooking : event))
        );
    };

    const updateVendorBooking = (vendorId, updatedBooking) => {
        setBookedVendors((prev) =>
            prev.map((vendor) => (vendor._id === vendorId ? updatedBooking : vendor))
        );
    };

    // Fetch user data and token from local storage and authenticate on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken');

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

        return () => {
            setLoading(false); // Cleanup
        };
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
                cartEvents,
                cartVendors,
                addToCart,
                removeFromCart,
                confirmBookings,
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
