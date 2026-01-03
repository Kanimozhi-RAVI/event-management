
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Signup from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BookingPage from "./components/Booking/BookingPage";
import MyBookings from "./components/Booking/Mybookings";
import AppLayout from "./components/layout/AppLayout";
import PageLoader from "./components/PageLoader";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { clearUser, setUser } from "./components/Redux/Actions/AuthAction";
import { auth } from "./lib/firebase";
import { useEffect, useState } from "react";

/* ================= ROUTES ================= */

function AppContent() {
  const location = useLocation();
  const { loading: authLoading } = useAuth(); // 🔑 Firebase auth loading
  const [pageLoading, setPageLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);


    useEffect(() => {
    console.log("🔐 Setting up auth listener");
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User logged in:", user.uid);
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
      } else {
        console.log("❌ User logged out");
        dispatch(clearUser());
      }
    });

    // Cleanup
    return () => {
      console.log("🔐 Cleaning up auth listener");
      unsubscribe();
    };
  }, [dispatch]);

  // 🔐 IMPORTANT: wait for Firebase auth
  if (authLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {pageLoading && <PageLoader />}

      <Routes location={location}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* PRIVATE ROUTES */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </>
  );
}

/* ================= MAIN APP ================= */

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
