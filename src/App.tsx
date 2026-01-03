import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import PrivateRoute from "./components/PrivateRoute";
import Signup from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BookingPage from "./components/Booking/BookingPage";
import MyBookings from "./components/Booking/Mybookings";
import AppLayout from "./components/layout/AppLayout";
import PageLoader from "./components/PageLoader";
import { useEffect, useState } from "react";


function AppContent() {
  const { loading } = useAuth(); // Firebase auth
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    // Loader on page navigation
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 🔐 Only show loader for auth or page navigation
  const showLoader = loading || pageLoading;

  return (
    <>
      {showLoader && <PageLoader />}

      <Routes location={location}>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
