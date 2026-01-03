import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Home, LogOut, UserCircle } from "lucide-react"; 
import logo from "@/assets/logo.png";
import { getUserBookingsRequest } from "../Redux/Actions/BookingActions";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../rootReducer";
import { logoutRequest } from "../Redux/Actions/AuthAction";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <motion.header className="bg-[#65C9DA] text-white flex items-center justify-between px-6 py-3 shadow-lg relative z-50">
      {/* Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-4 cursor-pointer"
      >
        <img src={logo} className="h-10" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <Home size={16} /> Home
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            navigate("/my-bookings");
            if (user?.uid) dispatch(getUserBookingsRequest(user.uid));
          }}
        >
          <Calendar size={16} /> My Bookings
        </Button>

        {/* Profile / Logout Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          {/* Profile Icon */}
          <UserCircle size={28} className="cursor-pointer" />

          {/* Dropdown */}
         <AnimatePresence>
  {dropdownOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden"
    >
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100 transition"
      >
        <LogOut size={16} /> Logout
      </button>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
