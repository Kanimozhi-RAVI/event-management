
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
import { clearUser, setUser } from "./Redux/Actions/AuthAction";
import { auth } from "./lib/firebase";
import { useEffect, useState } from "react";


function AppContent() {
  const location = useLocation();
  const { loading: authLoading } = useAuth(); 
  const [pageLoading, setPageLoading] = useState(false);
  const dispatch = useDispatch();
  const authRoutes = ["/login", "/signup",'/' ];


useEffect(() => {
  if (authRoutes.includes(location.pathname)) {
    setPageLoading(false); // ❌ no loader for login/signup
    return;
  }

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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

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


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
