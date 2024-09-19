// src/App.js
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext'; 
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary'; 
import './App.css';

// Lazy load components
const Home = React.lazy(() => import('./components/Home'));
const Events = React.lazy(() => import('./components/Events'));
const EventDetails = React.lazy(() => import('./components/EventDetails'));
const Vendors = React.lazy(() => import('./components/Vendors'));
const VendorDetails = React.lazy(() => import('./components/VendorDetails'));
const Budget = React.lazy(() => import('./components/Budget'));
const Login = React.lazy(() => import('./components/Login'));
const Register = React.lazy(() => import('./components/Register'));
const Contact = React.lazy(() => import('./components/Contact'));
const ForgotPassword = React.lazy(() => import('./components/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));
const RequestResetPassword = React.lazy(() => import('./components/RequestResetPassword'));
const UserAccount = React.lazy(() => import('./components/UserAccount'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const BookingConfirmation = React.lazy(() => import('./components/BookingConfirmation'));
const NotFound = React.lazy(() => import('./components/NotFound'));

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500); // Reduce loading time for better UX

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Router>
            <AppProvider>
                <ErrorBoundary>
                    <AppContent />
                </ErrorBoundary>
            </AppProvider>
        </Router>
    );
}

const AppContent = () => {
    const { darkMode } = useContext(AppContext);

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <div className="d-flex flex-column min-vh-100">
                <NavigationBar />
                <main className="flex-grow-1 mb-5">
                    <Suspense fallback={<LoadingScreen />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                            <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
                            <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
                            <Route path="/vendors/:id" element={<ProtectedRoute><VendorDetails /></ProtectedRoute>} />
                            <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                            <Route path="/reset-password-request" element={<RequestResetPassword />} />
                            <Route path="/user-account" element={<ProtectedRoute><UserAccount /></ProtectedRoute>} />
                            <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                            <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
            </div>
        </div>
    );
};  

export default App;
